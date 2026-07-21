import React, { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  SortingState,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table';
import { Search, Download, ArrowUpDown, ChevronLeft, ChevronRight, Eye, BatteryCharging, ShieldAlert } from 'lucide-react';
import { Vehicle } from '../../types';
import { useFleet } from '../../contexts/FleetContext';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { cn } from '../../utils/cn';

const columnHelper = createColumnHelper<Vehicle>();

export const VehicleTable: React.FC = () => {
  const {
    filteredVehicles,
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterFleet,
    setFilterFleet,
    setSelectedVehicle,
    selectedVehicle,
    exportCSV,
  } = useFleet();

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = [
    columnHelper.accessor('id', {
      header: 'Vehicle ID',
      cell: (info) => (
        <span className="font-mono font-bold text-teal-300">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('vin', {
      header: 'VIN',
      cell: (info) => <span className="font-mono text-slate-300">{info.getValue()}</span>,
    }),
    columnHelper.accessor('model', {
      header: 'Vehicle Model',
      cell: (info) => (
        <div className="flex flex-col">
          <span className="font-display font-medium text-slate-100">{info.getValue()}</span>
          <span className="text-[10px] font-mono text-slate-400">{info.row.original.fleet}</span>
        </div>
      ),
    }),
    columnHelper.accessor('driver', {
      header: 'Assigned Driver',
      cell: (info) => <span className="text-slate-300 text-xs">{info.getValue()}</span>,
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: (info) => {
        const val = info.getValue();
        let variant: any = 'neutral';
        if (val === 'Active') variant = 'active';
        else if (val === 'Charging') variant = 'charging';
        else if (val === 'Maintenance') variant = 'maintenance';
        else if (val === 'Critical Alert') variant = 'critical';
        return <Badge variant={variant}>{val}</Badge>;
      },
    }),
    columnHelper.accessor('soh', {
      header: 'Health (SOH)',
      cell: (info) => {
        const val = info.getValue();
        const color = val > 95 ? 'text-emerald-400' : (val > 88 ? 'text-amber-400' : 'text-red-400');
        return (
          <div className="flex items-center gap-2">
            <div className="w-12 bg-charcoal-700 h-1.5 rounded-full overflow-hidden">
              <div className={cn('h-full', val > 95 ? 'bg-emerald-400' : (val > 88 ? 'bg-amber-400' : 'bg-red-400'))} style={{ width: `${val}%` }} />
            </div>
            <span className={cn('font-mono font-bold text-xs', color)}>{val}%</span>
          </div>
        );
      },
    }),
    columnHelper.accessor('soc', {
      header: 'Charge (SOC)',
      cell: (info) => (
        <span className="font-mono text-slate-300 text-xs">{info.getValue()}%</span>
      ),
    }),
    columnHelper.accessor('packTemp', {
      header: 'Pack Temp',
      cell: (info) => {
        const temp = info.getValue();
        const isHot = temp > 40;
        return (
          <span className={cn('font-mono text-xs', isHot ? 'text-red-400 font-bold animate-pulse' : 'text-slate-300')}>
            {temp} °C
          </span>
        );
      },
    }),
    columnHelper.accessor('mileage', {
      header: 'Mileage',
      cell: (info) => <span className="font-mono text-slate-400 text-xs">{info.getValue().toLocaleString()} km</span>,
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Inspect',
      cell: (info) => (
        <button
          onClick={() => setSelectedVehicle(info.row.original)}
          className="p-1.5 rounded-lg bg-charcoal-800/80 hover:bg-teal-500/20 text-teal-400 border border-charcoal-600/40 transition-colors cursor-pointer"
          title="Inspect Pack Cells & Diagnostics"
        >
          <Eye className="w-4 h-4" />
        </button>
      ),
    }),
  ];

  const table = useReactTable({
    data: filteredVehicles,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <Card className="border-charcoal-600/40 p-5 space-y-4">
      {/* Controls Header */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pb-3 border-b border-charcoal-700/40">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search 300 vehicles by VIN, Driver, ID, or Model..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-charcoal-900 border border-charcoal-600/60 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-teal-400"
          />
        </div>

        {/* Filter Selects & CSV Export */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs font-mono rounded-xl bg-charcoal-900 border border-charcoal-600/60 text-slate-200 focus:outline-none focus:border-teal-400 cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Charging">Charging</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Critical Alert">Critical Alert</option>
          </select>

          {/* Fleet Subgroup Filter */}
          <select
            value={filterFleet}
            onChange={(e) => setFilterFleet(e.target.value)}
            className="px-3 py-2 text-xs font-mono rounded-xl bg-charcoal-900 border border-charcoal-600/60 text-slate-200 focus:outline-none focus:border-teal-400 cursor-pointer"
          >
            <option value="All">All Fleet Subgroups</option>
            <option value="Urban Logistics">Urban Logistics</option>
            <option value="Heavy Haul">Heavy Haul</option>
            <option value="Bus Transit">Bus Transit</option>
            <option value="Regional Delivery">Regional Delivery</option>
          </select>

          {/* Export CSV Button */}
          <Button variant="outline" size="sm" icon={<Download className="w-3.5 h-3.5" />} onClick={exportCSV}>
            Export CSV
          </Button>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto rounded-xl border border-charcoal-700/50">
        <table className="w-full text-left text-xs">
          <thead className="bg-charcoal-900/90 border-b border-charcoal-700/50 text-slate-400 font-mono">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className="p-3.5 whitespace-nowrap font-medium">
                    {header.isPlaceholder ? null : (
                      <div
                        className={cn(
                          'flex items-center gap-1.5',
                          header.column.getCanSort() && 'cursor-pointer select-none hover:text-slate-100'
                        )}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() && <ArrowUpDown className="w-3 h-3 opacity-60" />}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="divide-y divide-charcoal-800/40">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="p-8 text-center text-slate-400 font-mono">
                  No vehicle records match search filter parameters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={cn(
                    'hover:bg-charcoal-800/50 transition-colors cursor-pointer',
                    selectedVehicle?.id === row.original.id && 'bg-teal-500/10 border-l-2 border-teal-400'
                  )}
                  onClick={() => setSelectedVehicle(row.original)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="p-3.5 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-slate-400 pt-2">
        <span>
          Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            filteredVehicles.length
          )}{' '}
          of {filteredVehicles.length} Vehicles
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            disabled={!table.getCanPreviousPage()}
            onClick={() => table.previousPage()}
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </Button>

          <span className="px-3 py-1 rounded-lg bg-charcoal-800 border border-charcoal-600/40 text-teal-300 font-bold">
            Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
          </span>

          <Button
            variant="ghost"
            size="sm"
            disabled={!table.getCanNextPage()}
            onClick={() => table.nextPage()}
          >
            Next <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
