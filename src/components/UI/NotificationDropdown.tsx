import { useEffect, useState } from "react";
import { Dropdown, Spinner } from "flowbite-react";
import { FiBell } from "react-icons/fi";
import { HiBell } from "react-icons/hi";
import { Link } from "react-router-dom";
import axios from "../../config/axios";

type Notification = {
  id: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      try {
        const { data } = await axios.get("/accounts/user/notifications/");
        setNotifications(
          data.results.filter((notif: Notification) => !notif.is_read)
        );
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
    const id = setInterval(fetchNotifications, 10000);
    return ()=> clearInterval(id)
  }, []);

  return (
    <div className="relative">
      <Dropdown
        label=""
        inline
        className="w-full lg:!w-[350px]"
        renderTrigger={() => (
          <div className="relative cursor-pointer">
            <HiBell size={30} className="text-white" />
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full px-1.5">
              {notifications.length || 0}
            </span>
          </div>
        )}
      >
        <Dropdown.Header>
          <span className="font-semibold text-sm">Notifications</span>
        </Dropdown.Header>

        {!isLoading && notifications.length === 0 && (
          <Dropdown.Item>
            <span className="text-gray-500 text-sm">No notifications</span>
          </Dropdown.Item>
        )}

        {!isLoading &&
          notifications.map((notification) => (
            <Dropdown.Item
              key={notification.id}
              className="max-w-full overflow-hidden"
            >
              <div className="flex justify-start items-start flex-col text-sm">
                <span className="font-semibold truncate max-w-[95%]">
                  {notification.message}
                </span>
                <span className="text-xs text-gray-400">
                  {new Date(notification.created_at).toLocaleString()}
                </span>
              </div>
            </Dropdown.Item>
          ))}

        <Dropdown.Divider />

        {isLoading ? (
          <div className="w-full flex justify-center items-center">
            <Spinner />
          </div>
        ) : (
          <Dropdown.Item>
            <Link
              to="notifications"
              className="text-blue-600 text-sm w-full text-center"
            >
              View all notifications
            </Link>
          </Dropdown.Item>
        )}
      </Dropdown>
    </div>
  );
};
