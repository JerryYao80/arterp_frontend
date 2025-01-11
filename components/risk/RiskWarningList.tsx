import React, { useState } from 'react';
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useRiskWarnings } from '@/hooks/useRiskWarnings';
import { RiskWarning, RiskWarningType, RiskWarningLevel, RiskWarningStatus } from '@/types/risk';
import { format } from 'date-fns';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function RiskWarningList() {
    const [selectedType, setSelectedType] = useState<RiskWarningType | undefined>();
    const [selectedStatus, setSelectedStatus] = useState<RiskWarningStatus>('ACTIVE');
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [selectedWarning, setSelectedWarning] = useState<RiskWarning | null>(null);
    const [isResolveDialogOpen, setIsResolveDialogOpen] = useState(false);

    const {
        warnings,
        loading,
        error,
        fetchWarnings,
        resolveWarning,
        deleteWarning
    } = useRiskWarnings(selectedType, selectedStatus);

    const handleTypeChange = (value: RiskWarningType) => {
        setSelectedType(value);
    };

    const handleStatusChange = (value: RiskWarningStatus) => {
        setSelectedStatus(value);
    };

    const handleResolve = async () => {
        if (selectedWarning && resolutionNotes) {
            await resolveWarning(selectedWarning.id, 'current-user', resolutionNotes);
            setIsResolveDialogOpen(false);
            setResolutionNotes('');
            setSelectedWarning(null);
        }
    };

    const getLevelBadge = (level: RiskWarningLevel) => {
        const variants = {
            LOW: 'bg-green-100 text-green-800',
            MEDIUM: 'bg-yellow-100 text-yellow-800',
            HIGH: 'bg-orange-100 text-orange-800',
            CRITICAL: 'bg-red-100 text-red-800'
        };
        return <Badge className={variants[level]}>{level}</Badge>;
    };

    const getStatusBadge = (status: RiskWarningStatus) => {
        const variants = {
            ACTIVE: <Badge className="bg-blue-100 text-blue-800">ACTIVE</Badge>,
            RESOLVED: <Badge className="bg-green-100 text-green-800">RESOLVED</Badge>,
            IGNORED: <Badge className="bg-gray-100 text-gray-800">IGNORED</Badge>
        };
        return variants[status];
    };

    if (error) {
        return <div className="text-red-500">Error: {error}</div>;
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-4">
                <div className="w-48">
                    <Select
                        value={selectedType}
                        onValueChange={handleTypeChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="CUSTOMER">Customer</SelectItem>
                            <SelectItem value="BUSINESS">Business</SelectItem>
                            <SelectItem value="RESOURCE">Resource</SelectItem>
                            <SelectItem value="FINANCIAL">Financial</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="w-48">
                    <Select
                        value={selectedStatus}
                        onValueChange={handleStatusChange}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="RESOLVED">Resolved</SelectItem>
                            <SelectItem value="IGNORED">Ignored</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created At</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {warnings.map((warning) => (
                            <TableRow key={warning.id}>
                                <TableCell>{warning.type}</TableCell>
                                <TableCell>{getLevelBadge(warning.level)}</TableCell>
                                <TableCell>{warning.message}</TableCell>
                                <TableCell>{getStatusBadge(warning.status)}</TableCell>
                                <TableCell>
                                    {format(new Date(warning.createdAt), 'MMM dd, yyyy HH:mm')}
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        {warning.status === 'ACTIVE' && (
                                            <>
                                                <Dialog
                                                    open={isResolveDialogOpen}
                                                    onOpenChange={setIsResolveDialogOpen}
                                                >
                                                    <DialogTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => setSelectedWarning(warning)}
                                                        >
                                                            <CheckCircle className="h-4 w-4 mr-1" />
                                                            Resolve
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent>
                                                        <DialogHeader>
                                                            <DialogTitle>Resolve Risk Warning</DialogTitle>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            <div className="space-y-2">
                                                                <Label>Resolution Notes</Label>
                                                                <Textarea
                                                                    value={resolutionNotes}
                                                                    onChange={(e) => setResolutionNotes(e.target.value)}
                                                                    placeholder="Enter resolution notes..."
                                                                />
                                                            </div>
                                                            <Button
                                                                onClick={handleResolve}
                                                                disabled={!resolutionNotes}
                                                            >
                                                                Resolve Warning
                                                            </Button>
                                                        </div>
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => deleteWarning(warning.id)}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </>
                                        )}
                                        {warning.status === 'RESOLVED' && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    setSelectedWarning(warning);
                                                    setResolutionNotes(warning.resolutionNotes || '');
                                                }}
                                            >
                                                View Resolution
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {warnings.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-4">
                                    {loading ? (
                                        <div>Loading...</div>
                                    ) : (
                                        <div className="flex items-center justify-center text-gray-500">
                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                            No risk warnings found
                                        </div>
                                    )}
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
} 