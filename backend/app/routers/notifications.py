from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.notification import Notification
from app.models.user import User
from app.routers.auth import get_current_user_dependency

router = APIRouter(prefix='/notifications', tags=['Notifications'])


def _serialize(item: Notification) -> dict:
    return {
        'id': item.id,
        'title': item.title,
        'message': item.message,
        'read': item.read,
        'created_at': str(item.created_at),
    }


@router.get('', summary='List notifications for current business')
async def list_notifications(current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    items = (
        db.query(Notification)
        .filter(Notification.business_id == current_user.business_id)
        .order_by(Notification.created_at.desc())
        .limit(50)
        .all()
    )
    unread_count = (
        db.query(Notification)
        .filter(Notification.business_id == current_user.business_id, Notification.read.is_(False))
        .count()
    )
    return {
        'items': [_serialize(i) for i in items],
        'unread_count': unread_count,
        'business_id': current_user.business_id,
    }


@router.put('/{notification_id}/read', summary='Mark a notification as read')
async def mark_read(notification_id: int, current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    item = (
        db.query(Notification)
        .filter(Notification.id == notification_id, Notification.business_id == current_user.business_id)
        .first()
    )
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail='Notification not found')
    item.read = True
    db.commit()
    return {'success': True}


@router.put('/read-all', summary='Mark all notifications as read')
async def mark_all_read(current_user: User = Depends(get_current_user_dependency), db: Session = Depends(get_db)):
    db.query(Notification).filter(
        Notification.business_id == current_user.business_id, Notification.read.is_(False)
    ).update({'read': True})
    db.commit()
    return {'success': True}
