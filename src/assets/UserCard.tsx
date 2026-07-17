import type { User } from "../types/index";
interface UserCardProps {
    user: User;
}
function UserCard({ user }: UserCardProps) {
    return (
        <div className="user-card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>Role: {user.role}</p>
        </div>
    );
}
export default UserCard;