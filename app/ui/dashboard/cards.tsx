import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import prisma from '@/app/lib/db';
const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

export default async function CardWrapper() {
  const numberOfInvoices = await prisma.invoices.count();
  const numberOfCustomers = await prisma.customers.count();
  const totalPaidInvoices = await prisma.invoices.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: {
        contains: 'paid',
      },
    },
  });
  const totalPendingInvoices = await prisma.invoices.aggregate({
    _sum: {
      amount: true,
    },
    where: {
      status: {
        contains: 'pending',
      },
    },
  });
  return (
    <>
      <Card
        title="Collected"
        value={totalPaidInvoices._sum.amount ?? 0}
        type="collected"
      />
      <Card
        title="Pending"
        value={totalPendingInvoices._sum.amount ?? 0}
        type="pending"
      />
      <Card title="Total Invoices" value={numberOfInvoices} type="invoices" />
      <Card
        title="Total Customers"
        value={numberOfCustomers}
        type="customers"
      />
    </>
  );
}

export function Card({
  title,
  value,
  type,
}: {
  title: string;
  value: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
}) {
  const Icon = iconMap[type];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p
        className={`${lusitana.className}
          truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
      >
        {value}
      </p>
    </div>
  );
}
