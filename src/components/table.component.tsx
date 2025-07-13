'use client'

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

import { Product } from "@/types/page"


interface TableComponentProps {
    productsList: Product[],
    setProductsList: React.Dispatch<React.SetStateAction<Product[]>>
}

const columnConfig = [
    { key: 'id', label: 'ID' },
    { key: 'title', label: 'Title' },
    { key: 'brand', label: 'Brand' },
    { key: 'category', label: 'Category' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
    { key: 'rating', label: 'Rating' },
]

export default function TableComponent({ productsList, setProductsList }: TableComponentProps) {
    const [products, setProducts] = useState<Product[]>([])
    const [page, setPage] = useState(1)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [selectedRows, setSelectedRows] = useState<number[]>([])
    const [visibleColumns, setVisibleColumns] = useState<string[]>(columnConfig.map(c => c.key))

    const totalPages = Math.ceil(products.length / rowsPerPage)

    useEffect(() => {
        // fetch("https://dummyjson.com/products?limit=100")
        //   .then((res) => res.json())
        //   .then((data) => setProducts(data.products))

        setProducts(productsList);
    }, [productsList])

    const paginatedData = products.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    )

    const handlePageChange = (dir: "prev" | "next" | "first" | "last") => {
        if (dir === "first") setPage(1)
        else if (dir === "last") setPage(totalPages)
        else if (dir === "prev" && page > 1) setPage(page - 1)
        else if (dir === "next" && page < totalPages) setPage(page + 1)
    }

    const handleSelectRow = (id: number) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    const toggleColumn = (key: string) => {
        setVisibleColumns(prev =>
            prev.includes(key) ? prev.filter(col => col !== key) : [...prev, key]
        )
    }

    const handleDeleteSelected = () => {
        const updated = products.filter(product => !selectedRows.includes(product.id))
        setProducts(updated)
        setSelectedRows([])
        setProductsList(updated) // ✅ Now it’s defined and passed up to parent
    }

    return (
        <div id="products" className="rounded-md border-[1px] bg-background p-4 shadow-sm">
            <p className="text-muted-foreground font-medium text-xl">Products </p>
            {/* Column Customization Dropdown + Delete Button */}
            <div className="flex justify-end mb-4 gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                            <i className="fi fi-rr-settings-sliders mr-2"></i>
                            Customize Columns
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {columnConfig.map(col => (
                            <DropdownMenuCheckboxItem
                                key={col.key}
                                checked={visibleColumns.includes(col.key)}
                                onCheckedChange={() => toggleColumn(col.key)}
                            >
                                {col.label}
                            </DropdownMenuCheckboxItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="destructive" size="sm" disabled={selectedRows.length === 0} onClick={handleDeleteSelected}>
                    <i className="fi fi-rr-trash mr-2"></i>
                    {selectedRows.length > 0 ? `Delete ${selectedRows.length} Selected` : "Delete Selected"}
                </Button>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead><Checkbox disabled /></TableHead>
                        {columnConfig.map(col => (
                            visibleColumns.includes(col.key) && (
                                <TableHead key={col.key}>{col.label}</TableHead>
                            )
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {paginatedData.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>
                                <Checkbox
                                    checked={selectedRows.includes(product.id)}
                                    onCheckedChange={() => handleSelectRow(product.id)}
                                />
                            </TableCell>
                            {visibleColumns.includes('id') && <TableCell>{product.id}</TableCell>}
                            {visibleColumns.includes('title') && <TableCell>{product.title}</TableCell>}
                            {visibleColumns.includes('brand') && <TableCell>{product.brand}</TableCell>}
                            {visibleColumns.includes('category') && <TableCell>{product.category}</TableCell>}
                            {visibleColumns.includes('price') && <TableCell>${product.price}</TableCell>}
                            {visibleColumns.includes('stock') && <TableCell>{product.stock}</TableCell>}
                            {visibleColumns.includes('rating') && <TableCell>{product.rating}</TableCell>}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* Pagination Footer */}
            <div className="mt-4 flex items-center justify-between px-2 text-sm text-muted-foreground">
                <div>{`${selectedRows.length} of ${products.length} row(s) selected.`}</div>

                <div className="flex items-center space-x-4">
                    <span>Rows per page</span>
                    <Select value={rowsPerPage.toString()} onValueChange={(value) => {
                        setRowsPerPage(Number(value))
                        setPage(1)
                    }}>
                        <SelectTrigger className="w-[70px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {[10, 20, 30].map((val) => (
                                <SelectItem key={val} value={val.toString()}>{val}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <span>{`Page ${page} of ${totalPages}`}</span>

                    <div className="flex items-center space-x-2">
                        <button onClick={() => handlePageChange("first")} className="p-1 rounded hover:bg-muted">
                            <i className="fi fi-rr-angle-double-left"></i>
                        </button>
                        <button onClick={() => handlePageChange("prev")} className="p-1 rounded hover:bg-muted">
                            <i className="fi fi-rr-angle-left"></i>
                        </button>
                        <button onClick={() => handlePageChange("next")} className="p-1 rounded hover:bg-muted">
                            <i className="fi fi-rr-angle-right"></i>
                        </button>
                        <button onClick={() => handlePageChange("last")} className="p-1 rounded hover:bg-muted">
                            <i className="fi fi-rr-angle-double-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
