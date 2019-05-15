import axios from "axios";
import { React, Table, TableBody, TableCell, TableHead, TableRow,
  InfoCard, ContainerHeader, CardBox, Paper, Input, InputLabel, MenuItem,
  FormControl, FormHelperText, Select, Toolbar, Card, CardBody, Tooltip, IconButton,
  connect, TablePagination, TableFooter, CardSubtitle, CardText, TextField, cloneElement,
  Component, Button, moment, DayPickerInput, formatDate, parseDate, Helmet, CircularProgress } from "./plugins";
import DateRange from "../../../../../../../components/common/DateRange";
import { ytel_users1 } from "./data";
import { fetchGlobal } from "../../../../../../../actions/Global";

class Access extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          isLoading: false,
          data: [],
          page: 0,
          rowsPerPage: DEFAULT_PAGE_SIZE,
          total: 0,
          from: moment(new Date()).format("YYYY-MM-DD"),
          to: moment(new Date()).format("YYYY-MM-DD"),          
          admin: 0,          
          date: '',
          ytel_users: [],
          error: false
        };
    }

  componentDidMount() {
    this.getAllAccess(0, '25');
    this.props.fetchGlobal(["ytel_user"]);
  }

  componentWillReceiveProps(nextPropsFromRedux) {
      this.setState({
        ytel_users: nextPropsFromRedux.global.ytel_user
          ? nextPropsFromRedux.global.ytel_user
          : []
      });
  }
 
  getAllAccess (page, rowsPerPage, admin = 298, date = null) {      
      this.setState({ isLoading: true });
      let current_page = page + 1;
      axios.post("/api/admin-utilities/system-audit-access", {
          page: current_page, limit: rowsPerPage, admin: admin, date: date
      }).then(response => {
          let records = response.data.data;          
          this.setState({ data: records.data, total: records.total, isLoading: false });            
      }).catch(function(error) {
              this.setState({isLoading: false});
              console.log(error);
      });

  };

  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };

  handleChangeRowsPerPage = (event) => {                       
      this.setState({ rowsPerPage: event.target.value, data: [] });      
      this.getAllAccess(this.state.page, event.target.value);        
  };

  handlePageChange = (event, page) => {        
      this.setState({ page, data: [] });
      this.getAllAccess(page, this.state.rowsPerPage);
  };

  handleSubmit = (event) => {
      event.preventDefault();
      let { admin, date, rowsPerPage } = this.state; 
      this.setState({ data: [] });
      admin = (admin == 0)? null :admin;
      date = (date == '')? null :date;
      this.getAllAccess(0, rowsPerPage, admin, date);
  };

  render() {
    
    const { admin, rowsPerPage, page, total, date, ytel_users } = this.state;

    return (
      <div>
        <ContainerHeader match={this.props.match} title="System Audit - Access" />
        <CardBox styleName="col-lg-12" heading="">          
          <form className="row" autoComplete="off" onSubmit={this.handleSubmit}>            
            
            <div className="col-lg-4 col-sm-4 col-12">
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

            <div className="col-lg-4 col-sm-4 col-12">
                <FormControl className="w-100 mb-2">
                    <InputLabel htmlFor="date">Date</InputLabel>
                    <Input type="date" value={date} id="date" onChange={this.handleChange("date")} />                   
                </FormControl> 
            </div>

            <div className="col-lg-4 col-sm-4 col-12">
                <Button color="primary" type="submit" className="jr-btn bg-success text-white">
                    Appay Filter
                </Button>
            </div>
          </form>    
        </CardBox>

        <Card className="shadow border-0 bg-default text-black">
          <CardBody>            
            <Paper>
              <div className="table-responsive-material">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Username</TableCell>
                      <TableCell>IP</TableCell>
                      <TableCell>Browser</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {this.state.data.map((row, i) => (
                      <TableRow key={row.id}>
                        <TableCell>{moment(row.entry_datetime).format("DD-MM-YYYY")}</TableCell>
                        <TableCell>{row.username}</TableCell>
                        <TableCell>{row.ip}</TableCell>
                        <TableCell>{row.browser}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                  <TableFooter>
                    <TableRow>
                      <TablePagination
                        count={parseInt(total)}
                        rowsPerPage={rowsPerPage}
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

export default connect( mapStateToProps, mapDispatchToProps )(Access);