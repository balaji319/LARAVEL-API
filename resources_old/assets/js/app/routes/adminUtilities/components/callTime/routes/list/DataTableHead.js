import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import MenuItem from '@material-ui/core/MenuItem';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';

let counter = 0;

const columnData = [
    {id: 'Call Time ID', numeric: false,disablePadding: false, label: 'Call Time ID'},
    {id: 'Call Time Name  ', numeric: true, disablePadding: false,  textAlign:'left',  label: 'Call Time Name'},
    {id: 'Default Start', numeric: true, disablePadding: false,  textAlign:'left', label: 'Default Start'},
    {id: 'Default Stop', numeric: true, disablePadding: false, textAlign:'left',  label: 'Default Stop'},
    {id: 'Modify', numeric: true, disablePadding: false,  textAlign:'center', label: 'Modify'},
];

class DataTableHead extends React.Component {
    static propTypes = {
        numSelected: PropTypes.number.isRequired,
        onRequestSort: PropTypes.func.isRequired,
        order: PropTypes.string.isRequired,
        orderBy: PropTypes.string.isRequired,
        rowCount: PropTypes.number.isRequired,
    };

    createSortHandler = property => event => {
            this.props.onRequestSort(event, property);
        }
    ;
            render() {
        const {order, orderBy, numSelected, rowCount ,inbound} = this.props;

        return (
                <TableHead>
                    <TableRow>
                
                        {columnData.map(column => {
                                return (
                                                        <TableCell className={column.textAlign}
                                                                   key={column.id}
                                                                   numeric={column.numeric}
                                                                   padding={column.disablePadding ? 'none' : 'default'}
                                                                   padding={column.disablePadding ? 'none' : 'default'}
                                                                   style={{flexDirection:'row',textAlign:column.textAlign,color:'#040404',fontSize:'15px'}}

                                                                   >
                                                            <Tooltip
                                                                title={column.label}
                                                                placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                                                enterDelay={300}
                                                                >
                                                                <TableSortLabel
                                                                    active={orderBy === column.id}
                                                                    direction={order}
                                                                    onClick={this.createSortHandler(column.id)}
                                                                    >
                                                                    {column.label}
                                                                </TableSortLabel>
                                                            </Tooltip>
                                                        </TableCell>
                                        );
                        }, this)}
                    </TableRow>
                </TableHead>
                            );
            }
        }


        export default DataTableHead ;