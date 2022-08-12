import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { formulateDate } from "../utils/helpers/date/messageDate";
import styles from "scss/components/BellDropdown.module.scss";

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
    const [stateValue, stateSetter] = props.state;
    const { notifications } = useSelector((state) => state.notificationsState);
    const dispatch = useDispatch();

    return (
        <div className={`${styles.dropdown} ${stateValue ? styles.open : ""}`} ref={ref}>
            {notifications?.map((not) => (
                <NotificationCard key={not.id} title={`New Message from ${not.senderName}`} notify={true} createdAt={not.createdAt} />
            ))}
        </div>
    );
}

export default BellDropdown;
