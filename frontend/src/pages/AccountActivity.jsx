import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownIcon, ArrowUpIcon, SendIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from "lucide-react";


export const AccountActivity = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [type, setType] = useState("");
  const [sort, setSort] = useState("desc");
  const [limit, setLimit] = useState(10);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const page = searchParams.get('page') || 1;

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page,
          limit,
          type,
          sort,
        });
        const response = await fetch(
          `http://localhost:3000/api/v1/transaction?${params.toString()}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch transactions");
        }

        const data = await response.json();
        setTransactions(data.transactions);
        setTotalTransactions(data.totalTransactions);
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setError(error.message || "Failed to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [page, limit, type, sort, location.search]);

   const handlePageChange = (newPage) => {
         const params = new URLSearchParams(searchParams)
            params.set('page', newPage)
        setSearchParams(params)
  };


  if (loading) {
    return <div>Loading transaction history...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">{error}</div>;
  }

  const totalPages = Math.ceil(totalTransactions / limit);

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <Button
          key={i}
          variant={parseInt(page) === i ? 'default' : 'ghost'}
          onClick={() => handlePageChange(i)}
          size="sm"
        >
          {i}
        </Button>
      );
    }
    return buttons;
  };


  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Account Activity History</CardTitle>
            <CardDescription>Recent transactions and account activities</CardDescription>
          </div>
          <div className="flex gap-4 items-center">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Sort by:</p>
              <Select onValueChange={(value) => setSort(value)} defaultValue={sort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Newest first</SelectItem>
                  <SelectItem value="asc">Oldest first</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">Items per page</p>
              <Select onValueChange={(value) => setLimit(value)} defaultValue={limit}>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="select page limit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={5}>5</SelectItem>
                  <SelectItem value={10}>10</SelectItem>
                  <SelectItem value={20}>20</SelectItem>
                  <SelectItem value={50}>50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.transactionId}>
                <TableCell className="font-medium">
                  <div className="flex items-center">
                    {transaction.type === "deposit" && (
                      <ArrowDownIcon className="mr-2 h-4 w-4 text-green-500" />
                    )}
                    {transaction.type === "withdrawal" && (
                      <ArrowUpIcon className="mr-2 h-4 w-4 text-red-500" />
                    )}
                    {transaction.type === "transfer" && (
                      <SendIcon className="mr-2 h-4 w-4 text-blue-500" />
                    )}
                    {transaction.type.charAt(0).toUpperCase() +
                      transaction.type.slice(1)}
                  </div>
                </TableCell>
                <TableCell>₹{Math.abs(transaction.amount).toFixed(2)}</TableCell>
                <TableCell>{format(new Date(transaction.timestamp), 'MMM d, yyyy HH:mm')}</TableCell>
                <TableCell>{transaction.description}</TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      transaction.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : transaction.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.status.charAt(0).toUpperCase() +
                      transaction.status.slice(1)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
          {totalPages > 1 &&
             <nav className="flex items-center justify-between w-full mt-4">
                     <Button
                        onClick={() => handlePageChange(parseInt(page) - 1)}
                            disabled={parseInt(page) === 1}
                             size="sm"
                            variant="outline"
                        >
                             <ChevronLeft className="mr-2 h-4 w-4" />
                                Previous
                             </Button>
                            <div className="flex gap-2">
                                   {renderPageButtons()}
                              </div>
                          <Button
                              onClick={() => handlePageChange(parseInt(page) + 1)}
                            disabled={parseInt(page) === totalPages}
                            size="sm"
                              variant="outline"
                          >
                               Next
                            <ChevronRight className="ml-2 h-4 w-4" />
                             </Button>
                        </nav>

          }
      </CardContent>
    </Card>
  );
};