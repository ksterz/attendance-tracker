import { useEffect, useState } from "preact/hooks";
import { Data } from "utils";

export default function Notification({ notificationMessage }: Data) {
  const notificationShow = notificationMessage ? true : false;
  const [show, setShow] = useState(notificationShow);

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => setShow(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show) return null;

  return (
    <div class="notification">
      {notificationMessage}
    </div>
  );
}
