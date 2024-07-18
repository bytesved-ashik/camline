// ** React Imports
import { useEffect, useMemo, useState } from "react";
import Paper from "@mui/material/Paper";
import moment from "moment";
import { useSession } from "next-auth/react";
import { ROLE } from "@/enums/role.enums";
import { Box, Button, CardHeader, Grid, TablePagination, TableSortLabel } from "@mui/material";
import { getAllReferals } from "@/services/user.service";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { IGetReferalResponse } from "@/types/interfaces/sessionRequest.interface";
import { visuallyHidden } from "@mui/utils";
import AddNewReferalCode from "@/components/ui/dialogs/AddNewReferalCode";

interface Data {
  createdAt: number;
  name: string;
  source?: string;
}

function createData(createdAt: number, name: string, source?: string): Data {
  return {
    createdAt,
    name,
    source,
  };
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
}

type Order = "desc" | "asc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: readonly HeadCell[] = [
  {
    id: "name",
    numeric: true,
    disablePadding: false,
    label: "DATE/TIME",
  },
  {
    id: "source",
    numeric: false,
    disablePadding: false,
    label: "Source",
  },
  {
    id: "name",
    numeric: false,
    disablePadding: false,
    label: "Referal Code",
  },
];

interface EnhancedTableProps {
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const UserAccount = () => {
  const [records, setRecords] = useState([]);
  const { data: session } = useSession();
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<keyof Data>("createdAt");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [open, setOpen] = useState(false);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - records.length) : 0;

  const visibleRows = useMemo(
    () => stableSort(records, getComparator(order, orderBy)).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [order, orderBy, page, rowsPerPage, records]
  );

  useEffect(() => {
    getAllReferals()
      .then((data: any) => {
        const rows = data.data?.map((val: IGetReferalResponse) =>
          createData(new Date(val.createdAt).getTime(), val.referralCode, val.source ?? "")
        );
        setRecords(rows);
      })
      .catch((err: any) => {
        console.log("Error in referal API => ", err);
      });
  }, []);

  const onClose = () => {
    setOpen(false);
  };

  const onOpenReferalModal = () => {
    setOpen(true);
  };

  return (
    <Paper sx={{ height: "100%" }}>
      {session?.user.role === ROLE.ADMIN && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            "@media screen and (max-width: 767px)": {
              flexDirection: "column",
            },
            alignItems: "center",
          }}
        >
          <Grid item xs={6}>
            <CardHeader title="Referal Codes" />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              alignItems: "end",
              justifyContent: "end",
              marginRight: 5,
            }}
          >
            <Button variant="outlined" onClick={onOpenReferalModal}>
              {" "}
              Add Referal Code
            </Button>
          </Grid>
        </Box>
      )}

      <Box sx={{ width: "100%" }}>
        <TableContainer>
          <Table sx={{ minWidth: 750 }} aria-labelledby="tableTitle">
            <EnhancedTableHead
              onSelectAllClick={() => {
                console.log("selectall clicked");
              }}
              numSelected={records.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={records.length}
            />
            <TableBody>
              {visibleRows.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover tabIndex={-1} key={row.createdAt} sx={{ cursor: "pointer" }}>
                    <TableCell component="th" id={labelId} scope="row" padding="none">
                      {moment(row.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
                    </TableCell>
                    <TableCell>{row?.source}</TableCell>
                    <TableCell>{row?.name}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: 53 * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={records.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
      <AddNewReferalCode open={open} onClose={onClose} />
    </Paper>
  );
};
export default UserAccount;
