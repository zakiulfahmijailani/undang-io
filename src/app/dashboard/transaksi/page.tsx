export default function TransaksiPage() {
    const dummyTransactions = [
        { id: 'TRX-101', date: '14 Mar 2026', plan: 'Premium', amount: 'Rp 149.000', status: 'Berhasil' },
        { id: 'TRX-102', date: '10 Mar 2026', plan: 'Free', amount: 'Rp 0', status: 'Berhasil' },
        { id: 'TRX-103', date: '05 Mar 2026', plan: 'Eksklusif', amount: 'Rp 299.000', status: 'Pending' },
    ];

    if (dummyTransactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border mt-8">
                <p className="text-muted-foreground">Belum ada transaksi.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 max-w-6xl mx-auto pb-10">
            <div>
                <h1 className="text-2xl font-serif font-bold tracking-tight text-foreground">Riwayat Transaksi</h1>
                <p className="text-muted-foreground mt-1">Daftar riwayat pembelian paket dan langganan Anda.</p>
            </div>

            <div className="rounded-xl border border-border bg-card text-card-foreground shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-secondary/50 text-muted-foreground border-b border-border">
                            <tr>
                                <th className="font-medium p-4">Tanggal</th>
                                <th className="font-medium p-4">Paket</th>
                                <th className="font-medium p-4">Jumlah</th>
                                <th className="font-medium p-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {dummyTransactions.map((trx) => (
                                <tr key={trx.id} className="hover:bg-secondary/30 transition-colors">
                                    <td className="p-4 text-muted-foreground">{trx.date}</td>
                                    <td className="p-4 font-medium text-foreground">{trx.plan}</td>
                                    <td className="p-4 text-foreground">{trx.amount}</td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border ${
                                            trx.status === 'Berhasil'
                                                ? 'bg-green-50 text-green-700 border-green-200'
                                                : trx.status === 'Pending'
                                                ? 'bg-primary/10 text-primary border-primary/20'
                                                : 'bg-destructive/10 text-destructive border-destructive/20'
                                        }`}>
                                            {trx.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
