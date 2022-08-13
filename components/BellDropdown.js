import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { notificationsState } from "reduxState/slices/notificationsSlice";
import { formulateDate } from "../utils/helpers/date/messageDate";
import styles from "scss/components/BellDropdown.module.scss";
import { socket } from "./ChatModal";

const NotificationCard = ({ title, notify, createdAt }) => {
    return (
        <div className={`${styles.notificationCard} ${notify ? styles.notify : ""}`}>
            <h6 className={`${styles.notificationTitle} white`}>{title}</h6>
            <p className={`fs-10px white`}>{formulateDate(createdAt)}</p>
        </div>
    );
};

function BellDropdown(props) {
    const { ref } = props;
    const [stateValue] = props.state;
    const { notifications } = useSelector((state) => state.notificationsState);
    const { id } = useSelector((state) => state.authState);
    const dispatch = useDispatch();

    if (stateValue) {
        const readNotificatios = notifications.map((not) => {
            return { ...not, isRead: true };
        });
        setTimeout(() => {
            dispatch(notificationsState({ notifications: readNotificatios }));
            socket.current?.emit("remove-notifications", { userId: id, msgs: readNotificatios });
        }, 2000);
    }

    return (
        <div className={`${styles.dropdown} ${stateValue ? styles.open : ""}`} ref={ref}>
            {notifications?.map((not) => (
                <NotificationCard key={not.id} title={`New Message from ${not.senderName}`} notify={not.isRead} createdAt={not.createdAt} />
            ))}
        </div>
    );
}

export default BellDropdown;
