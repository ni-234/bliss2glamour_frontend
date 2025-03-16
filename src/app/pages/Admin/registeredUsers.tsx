import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllUsersFunction,
  updateActiveStatusFunction,
} from "@/functions/apiFunctions";
import { toast } from "sonner";

export default function RegisteredUsers() {
  const queryClient = useQueryClient();
  const {
    data: userData,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["registeredUsers"],
    queryFn: () =>
      getAllUsersFunction(localStorage.getItem("access_token") as string),
  });

  const updateActiveStausMutation = useMutation({
    mutationKey: ["updateActiveStatus"],
    mutationFn: ({
      access_token,
      id,
      status,
    }: {
      access_token: string;
      id: number;
      status: boolean;
    }) => updateActiveStatusFunction(access_token, id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["registeredUsers"] });
      toast.success("Status updated successfully");
    },
    onError: () => {
      toast.error("Error updating status");
    },
  });

  const handleStatusChange = (id: number, newStatus: string) => {
    updateActiveStausMutation.mutate({
      access_token: localStorage.getItem("access_token") as string,
      id,
      status: newStatus === "Active",
    });
  };

  return (
    <div>
      <div className="text-center font-bold text-indigo-950 mt-12">
        Registered Users
      </div>
      {isError && <div>Error fetching data</div>}
      {isSuccess && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>First Name</TableHead>
              <TableHead>Last Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {userData.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.username}</TableCell>
                <TableCell>{user.first_name}</TableCell>
                <TableCell>{user.last_name}</TableCell>
                <TableCell>
                  <Select
                    value={user.is_active ? "Active" : "InActive"}
                    onValueChange={(value) =>
                      handleStatusChange(user.id, value)
                    }
                    disabled={user.role === "admin"}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue>
                        {user.is_active ? "Active" : "InActive"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="InActive">InActive</SelectItem>
                      <SelectItem value="Active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell>{user.role.toUpperCase()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
