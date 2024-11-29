import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  type: "submission_received" | "submission_evaluated";
  metadata: {
    submissionId: string;
    studentId?: string;
    professorId?: string;
    status?: string;
    grade?: number;
  };
  createdAt: string;
}

export function useNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasNewNotification, setHasNewNotification] = useState(false);

  const fetchNotifications = async () => {
    try {
      if (!user?.id) {
        console.log("[useNotifications] Usuário não autenticado");
        return;
      }

      console.log("[useNotifications] Buscando notificações para:", user.id);
      const response = await fetch(
        `${API_URL}/api/notifications?userId=${user.id}`
      );

      if (!response.ok) {
        console.error(
          "[useNotifications] Erro na resposta:",
          await response.text()
        );
        throw new Error("Failed to fetch notifications");
      }

      const data = await response.json();
      console.log("[useNotifications] Notificações recebidas:", data);
      setNotifications(data);
    } catch (error) {
      console.error("[useNotifications] Erro ao buscar notificações:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(
        `${API_URL}/api/notifications/${id}/mark-read`,
        {
          method: "PATCH",
        }
      );
      if (!response.ok) throw new Error("Failed to mark notification as read");

      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchNotifications();
    }
  }, [user?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (user?.id) {
        fetchNotifications();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.id]);

  return {
    notifications,
    loading,
    markAsRead,
    unreadCount: Array.isArray(notifications)
      ? notifications.filter((n) => !n.read).length
      : 0,
    hasNewNotification,
    setHasNewNotification,
  };
}
