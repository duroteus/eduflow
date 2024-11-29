"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, CheckCircle, FileText, Loader2, XCircle } from "lucide-react";
import { useEffect } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function NotificationsDropdown() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    hasNewNotification,
    setHasNewNotification,
    loading,
  } = useNotifications();

  const shakeAnimation = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: {
        duration: 0.5,
      },
    },
  };

  useEffect(() => {
    if (hasNewNotification) {
      // Resetar o estado após a animação
      const timer = setTimeout(() => {
        setHasNewNotification(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasNewNotification, setHasNewNotification]);

  useEffect(() => {
    console.log("Notificações atualizadas:", notifications);
  }, [notifications]);

  const getIcon = (type: string) => {
    switch (type) {
      case "submission_received":
        return <FileText className="h-4 w-4 text-blue-500" />;
      case "submission_evaluated":
        return notifications.find((n) => n.metadata?.status === "APPROVED") ? (
          <CheckCircle className="h-4 w-4 text-green-500" />
        ) : (
          <XCircle className="h-4 w-4 text-red-500" />
        );
      default:
        return null;
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.div
          animate={hasNewNotification ? "shake" : ""}
          variants={shakeAnimation}
        >
          <Button variant="ghost" size="icon" className="relative">
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Bell className="h-5 w-5" />
            )}
            <AnimatePresence>
              {unreadCount > 0 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  className="absolute -right-1 -top-1"
                >
                  <Badge
                    variant="destructive"
                    className="h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center"
                  >
                    {unreadCount}
                  </Badge>
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 max-h-[70vh] overflow-y-auto"
      >
        {loading ? (
          <div className="p-4 text-center">
            <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground mt-2">
              Carregando notificações...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Nenhuma notificação
          </div>
        ) : (
          <AnimatePresence>
            {notifications.map((notification, index) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <DropdownMenuItem
                  className={`flex flex-col gap-1 p-4 cursor-pointer ${
                    !notification.read ? "bg-muted/50" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-center gap-2">
                    {getIcon(notification.type)}
                    <div className="font-medium">{notification.title}</div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {notification.message}
                  </p>
                  {notification.metadata?.grade && (
                    <p className="text-sm font-medium">
                      Nota: {notification.metadata.grade}/100
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                        locale: ptBR,
                      })}
                    </p>
                    {!notification.read && (
                      <Badge variant="secondary" className="text-xs">
                        Nova
                      </Badge>
                    )}
                  </div>
                </DropdownMenuItem>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
