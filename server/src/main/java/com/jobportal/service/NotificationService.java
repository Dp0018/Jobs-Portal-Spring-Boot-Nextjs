package com.jobportal.service;

import com.jobportal.dto.NotificationDto;
import com.jobportal.entity.Notification;
import com.jobportal.exception.JobPortalExceeption;

import java.util.List;

public interface NotificationService {
    public void sendNotification(NotificationDto notificationDto) throws JobPortalExceeption;
    public List<Notification> getUnreadNotifications(Long userId);
    public void readNotifications(Long id) throws JobPortalExceeption;

}
