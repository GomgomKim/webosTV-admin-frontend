import { Form, DatePicker, Input, Table, Button, Space } from "antd";
import React, { Component } from "react";
import { httpGet, httpUrl } from "../../api/httpClient";
import moment from "moment";
import "../../css/main.css";
import { riderLevel } from "../../lib/util/codeUtil";

const FormItem = Form.Item;
const Search = Input.Search;

class DeliveryHistoryEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      pagination: {
        total: 0,
        current: 1,
        pageSize: 10,
      },
      userName: "",
      userPhone: "",
    };
    this.formRef = React.createRef();
  }

  componentDidMount() {
    this.getList();
  }

  getList = () => {
    let pageNum = this.state.pagination.current;
    let pageSize = this.state.pagination.pageSize;
    httpGet(httpUrl.riderDeliveryList, [ pageNum, pageSize],{})
    .then((res) => {
        const pagination = { ...this.state.pagination };
        pagination.current = res.data.currentPage;
        pagination.total = res.data.totalCount;
        this.setState({
          list: res.data.orders,
          pagination
        });
    });
  };
  handleTableChange = (pagination) => {
    const pager = {
      ...this.state.pagination,
    };
    pager.current = pagination.current;
    pager.pageSize = pagination.pageSize;
    this.setState(
      {
        pagination: pager,
      },
      () => this.getList()
    );
  };

  render() {
    const columns = [
      {
        title: "월",
        dataIndex: "monthData",
        className: "table-column-center",
        width: "5%",
        render: (data) => <div>{moment(data).format("M")+"월"}</div>
      },
      {
        title: "직급",
        dataIndex: "riderLevel",
        className: "table-column-center",
        width: "5%",
        render: (data) => <div>{riderLevel[data]}</div>
      },
      {
        title: "직원명",
        dataIndex: "riderName",
        className: "table-column-center",
        width: "10%",
      },
      {
        title: "직원 연락처",
        dataIndex: "riderPhone",
        className: "table-column-center",
        width: "10%",
      },
      {
        title: "상태",
        dataIndex: "userStatus",
        className: "table-column-center",
        width: "8%",
      },
      {
        title: "기본건수",
        dataIndex: "basicDeliveryAmount",
        className: "table-column-center",
        width: "8%",
      },
      {
        title: "배달건수",
        dataIndex: "deliveryAmount",
        className: "table-column-center",
        width: "8%",
      },
      {
        title: "기본배달료",
        dataIndex: "basicDeliveryPrice",
        className: "table-column-center",
        width: "8%",
      },
      {
        title: "관리 인센티브",
        dataIndex: "teamCallIncen",
        className: "table-column-center",
        width: "8%",
      },
      {
        title: "가맹점 인센티브",
        dataIndex: "frBusinessIncen",
        className: "table-column-center",
        width: "8%",
      },
      {
        title: "추가 인센티브",
        dataIndex: "overCallIncen",
        className: "table-column-center",
        width: "8%",
      },
    ];

    return (
      <FormItem>
        <Space direction="vertical">
          <DatePicker
            onChange={this.onChangeDate}
            picker="month"
            placeholder="월별검색"
          />
        </Space>

        <Search
          placeholder="직원명 검색"
          enterButton
          allowClear
          onChange={(e) => this.setState({ rider: e.target.value })}
          onSearch={this.onSearchRider}
          style={{
            width: 220,
            marginLeft: 20,
          }}
        />

        <Search
          placeholder="전화번호 검색"
          enterButton
          allowClear
          onChange={(e) => this.setState({ Phone: e.target.value })}
          onSearch={this.onSearchPhone}
          style={{
            width: 220,
            marginLeft: 20,
          }}
        />

        <Button
          className="download-btn"
          style={{ float: "right", marginLeft: 10, marginBottom: 20 }}
          onClick={{}}
        >
          <img src={require("../../img/excel.png").default} alt="" />
          엑셀 다운로드
        </Button>

        <Table
          rowKey={(record) => record}
          dataSource={this.state.list}
          columns={columns}
          pagination={this.state.pagination}
          onChange={this.handleTableChange}
        />
      </FormItem>
    );
  }
}

export default DeliveryHistoryEmployee;
