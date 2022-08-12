import { useState, useEffect, useCallback } from "react";
import styles from "scss/components/UserCard.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { toggleState as toggleChatScreenState } from "reduxState/slices/chatModalSlice";
import { toggleState as toggleBlackScreenState } from "reduxState/slices/blackScreenSlice";
import { notificationsState } from "reduxState/slices/notificationsSlice";
import { chatUser } from "../reduxState/slices/chatUserSlice";
import { toCapital } from "../utils/helpers/toCapital";
import { socket } from "./ChatModal";

function UserCard({ id, email, name, skill, status }) {
    const [chatNotifications, setChatNotifications] = useState([]);
    const { auth, id: currentUserID } = useSelector((state) => state.authState);
    const { notifications } = useSelector((state) => state.notificationsState);
    const currentChatUser = useSelector((state) => state.chatUserState);
    const dispatch = useDispatch();

    useEffect(() => {
        if (auth) {
            let newNotifications = notifications?.filter(({ from }) => from === id && from !== currentChatUser?.id);
            console.log(currentChatUser, newNotifications);
            if (currentChatUser?.id) {
                socket.current?.emit("remove-notifications", { userId: currentUserID, msgs: newNotifications });
            }
            setChatNotifications(newNotifications);
        }
    }, [id, auth, currentUserID, currentChatUser, dispatch, notifications]);

    const removeReadMessages = () => {
        const unreadMsgs = notifications.filter(({ from }) => from !== id);
        dispatch(notificationsState({ notifications: unreadMsgs }));
        socket.current?.emit("remove-notifications", { userId: currentUserID, msgs: unreadMsgs });
    };

    const openChatDialog = () => {
        if (auth) {
            dispatch(chatUser({ id, email, username: name, status, skill }));
            removeReadMessages();
            if (!window.location.href.includes("chat")) {
                dispatch(toggleChatScreenState(true));
                dispatch(toggleBlackScreenState(true));
            }
        }
    };

    return (
        <div className={styles.card} onClick={openChatDialog}>
            <span className={`${styles.profilePicture} `}>
                {name?.slice(0, 1).toUpperCase()}
                <p className={status ? styles.online : styles.offline}></p>
            </span>
            <div>
                <h2 className="fs-20px weight-7 black mb-5px lh-1">{toCapital(name)}</h2>
                <p className="fs-14px black weight-4 lh-1">
                    {skill} - {chatNotifications?.length}
                </p>
            </div>
        </div>
    );
}

export default UserCard;
