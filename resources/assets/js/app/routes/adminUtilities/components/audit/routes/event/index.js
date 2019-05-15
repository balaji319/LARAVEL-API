import axios from 'axios';
import { React,Table,TableBody,TableCell,TableHead,TableRow,
    ContainerHeader, CardBox,Paper,Input,InputLabel,MenuItem,FormControl,
    FormHelperText,Select,Toolbar,Card,CardBody,Tooltip,IconButton,connect,TablePagination,
    TableFooter,CardSubtitle,CardText,TextField,cloneElement,Component,Button,moment,DayPickerInput,
    formatDate,parseDate,Helmet, CircularProgress } from './plugins';
import {events_option_list} from './data';
import {DateTimePicker} from 'material-ui-pickers';
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import { fetchGlobal } from "../../../../../../../actions/Global";

class Events extends React.Component {

     constructor(props) {
        super(props);
      
        this.state = {
            isLoading: false,
            data: [],
            page: 0,                        
            rowsPerPage: DEFAULT_PAGE_SIZE,
            total: 0,
            date: moment(new Date()).format("YYYY-MM-DD"),                   
            admin: 0,
            events: 0,            
            ytel_users: []
        }
    }

    componentDidMount() {
       this.getAllEvents(0, 25, '');
       this.props.fetchGlobal(["ytel_user"]);
    }

    componentWillReceiveProps(nextPropsFromRedux) {
        this.setState({
          ytel_users: nextPropsFromRedux.global.ytel_user
            ? nextPropsFromRedux.global.ytel_user
            : []
        });
    }

    handleChange = name => event => {
        this.setState({[name]: event.target.value});       
    };

    handleSubmit = (event) => {
        event.preventDefault();
        let { admin, date, events, rowsPerPage } = this.state; 
        this.setState({ data: [] });
        admin = (admin == 0)? null :admin;
        events = (events == 0)? null :events;
        this.getAllEvents(0, rowsPerPage, admin, events, date);
    };

    getAllEvents (page, rowsPerPage, admin = null, events = null, date = null) {        
        this.setState({ isLoading: true });
        let current_page = page + 1;
        axios.post("/api/admin-utilities/system-audit-event", {
            page: current_page, limit: rowsPerPage, admin: admin, events: events, date: date
        }).then(response => {
            let records = response.data.data;            
            this.setState({ data: records.data, total: records.total, isLoading: false });            
        }).catch(function(error) {
            this.setState({isLoading: false});
            console.log(error);
        });

    };

    handleChangeRowsPerPage = (event) => {                       
        this.setState({ rowsPerPage: event.target.value, data: [] });      
        this.getAllEvents(this.state.page, event.target.value);        
    };

    handlePageChange = (event, page) => {        
        this.setState({ page, data: [] });
        this.getAllEvents(page, this.state.rowsPerPage);
    };
    
    handleDateChange = date => {
        this.setState({ date: moment(date).format("YYYY-MM-DD") });
    };

    render() {

        const { events, admin, rowsPerPage, page, total, ytel_users, date } = this.state;        

        return (    
            <div>
                <ContainerHeader match={this.props.match} title='System Audit - Event'/>
                <CardBox styleName="col-lg-12" heading="">
            
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <form className="row" autoComplete="off" onSubmit={this.handleSubmit}>                        

                        <div className="col-lg-3 col-sm-3 col-12">
                            <FormControl className="w-100 mb-2">
                                <InputLabel htmlFor="events">Event</InputLabel>
                                <Select
                                    value={events}                                    
                                    onChange={this.handleChange("events")}
                                    name="events"
                                    input={<Input id="events" />}
                                    fullWidth
                                >
                                {events_option_list && events_option_list.map(option => (
                                    <MenuItem key={option.value} value={option.value}>                                     
                                        {option.label}
                                    </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>
                        
                        <div className="col-lg-3 col-sm-3 col-12">
                            <FormControl className="w-100 mb-2">
                                <InputLabel htmlFor="admin">Admin</InputLabel>
                                <Select
                                    id="select-users-native"                            
                                    value={admin}
                                    onChange={this.handleChange("admin")}
                                    input={<Input id="admin" />}
                                    fullWidth                                    
                                    tabIndex="-1"
                                >
                                {ytel_users && ytel_users.map(option => (
                                    <MenuItem key={option.x5_contact_id} value={option.x5_contact_id}>                                        
                                        {option.username}
                                    </MenuItem>
                                ))}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="col-lg-3 col-sm-3 col-12">
                            <FormControl className="w-100 mb-2">
                                <InputLabel htmlFor="date">Date</InputLabel>                                
                                <DateTimePicker
                                    fullWidth
                                    format="YYYY-MM-DD HH:mm:ss"
                                    value={date}
                                    showTabs={false}
                                    onChange={this.handleDateChange}
                                    leftArrowIcon={<i className="zmdi zmdi-arrow-back" />}
                                    rightArrowIcon={<i className="zmdi zmdi-arrow-forward" />}
                                />
                            </FormControl> 
                        </div>

                        <div className="col-lg-3 col-sm-3 col-12">
                            <Button color="primary" type="submit" className="jr-btn bg-success text-white">
                                Appay Filter
                            </Button>
                        </div>

                    </form>
                    </MuiPickersUtilsProvider>
                </CardBox>`
       
                <Card className="shadow border-0 bg-default text-black">
                    <CardBody>                        
                        <Paper>
                            <div className="table-responsive-material">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Event</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Admin</TableCell>
                                            <TableCell>Date</TableCell>
                                            <TableCell>IP</TableCell>                                                                                    
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.state.data.map((row, i) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{row.event}</TableCell>
                                                <TableCell>{row.description}</TableCell>
                                                <TableCell>{row.admin}</TableCell>
                                                <TableCell>{moment(row.change_datetime).format("DD-MM-YYYY")}</TableCell>
                                                <TableCell>{row.ip}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                    <TableFooter>
                                        <TableRow>
                                            <TablePagination
                                                count={parseInt(total)}
                                                rowsPerPage={parseInt(rowsPerPage)}
                                                page={page}
                                                onChangePage={this.handlePageChange}
                                                onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                            />
                                        </TableRow>
                                    </TableFooter>
                                </Table>
                            </div>
                        </Paper>
                        <br />
                        <br />
                    </CardBody>
                </Card>
                {this.state.isLoading && (
                    <div className="loader-view" id="loader-view">
                        <CircularProgress />
                    </div>
                )}
            </div>
        );
    }
}

function mapStateToProps(state, ownProps) {
    return {
        global: state.globel
    };
}
    
const mapDispatchToProps = {
        fetchGlobal
};

export default connect( mapStateToProps, mapDispatchToProps )(Events);

