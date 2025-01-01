import { ArrowUpIcon } from 'lucide-react';

export const Balance = ({balance, loading, error}) => {


  if (loading) {
    return <div className="font-bold text-lg">Loading balance...</div>;
  }

    if (error) {
    return <div className="text-red-500 text-sm">{error}</div>
  }

  return (
    <div>
      <div className="text-3xl font-bold">₹{balance}</div>
      <div className="mt-2 flex items-center text-sm text-green-600">
        <ArrowUpIcon className="mr-1 h-4 w-4" />
        +12.5% from last month
      </div>
    </div>
  );
};