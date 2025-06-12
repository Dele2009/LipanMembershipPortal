import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Table, Spinner, Alert, Button } from "flowbite-react";
import axios from "../../config/axios";

type User = {
  id: number;
  full_name: string;
  email: string;
  registered_at: string;
};

export default function AdminEventUsersPage() {
  const { id, title } = useParams<{ id: string; title: string }>();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`/admin/events/${id}/users/`);
        console.log(data);
        setUsers(data);
      } catch (err) {
        setError("Failed to fetch registered users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [id]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 capitalize">
        {title?.replace("-", " ")} - Registered Users
      </h1>

      {loading ? (
        <div className="flex justify-center">
          <Spinner size="xl" />
        </div>
      ) : error ? (
        <Alert color="failure">{error}</Alert>
      ) : users.length === 0 ? (
        <Alert color="warning">
          No users have registered for this event yet.
        </Alert>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <Table.Head>
              <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Registered At</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => (
                <Table.Row
                  key={user.id}
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <Table.Cell>{user.full_name}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {new Date(user.registered_at).toLocaleString()}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}
    </div>
  );
}
