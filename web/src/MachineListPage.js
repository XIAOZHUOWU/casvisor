// Copyright 2024 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import React from "react";
import {Link} from "react-router-dom";
import {Button, Table} from "antd";
import BaseListPage from "./BaseListPage";
import moment from "moment";
import * as Setting from "./Setting";
import * as MachineBackend from "./backend/MachineBackend";
import i18next from "i18next";
import PopconfirmModal from "./common/modal/PopconfirmModal";

class MachineListPage extends BaseListPage {
  constructor(props) {
    super(props);
  }

  newMachine() {
    return {
      owner: this.props.account.owner,
      name: `machine_${Setting.getRandomName()}`,
      createdTime: moment().format(),
      updatedTime: moment().format(),
      expireTime: "",
      displayName: `New Machine - ${Setting.getRandomName()}`,
      region: "West US 2",
      zone: "Zone 1",
      category: "Standard",
      type: "Pay As You Go",
      size: "Standard_D4ls_v5",
      tag: "",
      state: "Active",
      image: "Ubuntu 24.04",
      publicIp: "",
      privateIp: "",
    };
  }

  addMachine() {
    const newMachine = this.newMachine();
    MachineBackend.addMachine(newMachine)
      .then((res) => {
        if (res.status === "ok") {
          this.props.history.push({pathname: `/machines/${newMachine.owner}/${newMachine.name}`, mode: "add"});
          Setting.showMessage("success", "Machine added successfully");
        } else {
          Setting.showMessage("error", `Failed to add Machine: ${res.msg}`);
        }
      })
      .catch(error => {
        Setting.showMessage("error", `Machine failed to add: ${error}`);
      });
  }

  deleteMachine(i) {
    MachineBackend.deleteMachine(this.state.data[i])
      .then((res) => {
        if (res.status === "ok") {
          Setting.showMessage("success", "Machine deleted successfully");
          this.setState({
            data: Setting.deleteRow(this.state.data, i),
            pagination: {
              ...this.state.pagination,
              total: this.state.pagination.total - 1,
            },
          });
        } else {
          Setting.showMessage("error", `Failed to delete Machine: ${res.msg}`);
        }
      })
      .catch(error => {
        Setting.showMessage("error", `Machine failed to delete: ${error}`);
      });
  }

  renderTable(machines) {
    const columns = [
      {
        title: i18next.t("general:Organization"),
        dataIndex: "owner",
        key: "owner",
        width: "110px",
        sorter: true,
        ...this.getColumnSearchProps("owner"),
        render: (text, machine, index) => {
          return (
            <a target="_blank" rel="noreferrer" href={Setting.getMyProfileUrl(this.props.account).replace("/account", `/organizations/${text}`)}>
              {text}
            </a>
          );
        },
      },
      {
        title: i18next.t("general:Name"),
        dataIndex: "name",
        key: "name",
        width: "120px",
        sorter: true,
        ...this.getColumnSearchProps("name"),
        render: (text, record, index) => {
          return (
            <Link to={`/machines/${record.owner}/${record.name}`}>{text}</Link>
          );
        },
      },
      {
        title: i18next.t("general:Display name"),
        dataIndex: "displayName",
        key: "displayName",
        width: "120px",
        sorter: (a, b) => a.displayName.localeCompare(b.displayName),
      },
      {
        title: i18next.t("general:Created time"),
        dataIndex: "createdTime",
        key: "createdTime",
        width: "160px",
        // sorter: true,
        sorter: (a, b) => a.createdTime.localeCompare(b.createdTime),
        render: (text, machine, index) => {
          return Setting.getFormattedDate(text);
        },
      },
      {
        title: i18next.t("general:Expire time"),
        dataIndex: "expireTime",
        key: "expireTime",
        width: "160px",
        // sorter: true,
        sorter: (a, b) => a.expireTime.localeCompare(b.expireTime),
        render: (text, machine, index) => {
          return Setting.getFormattedDate(text);
        },
      },
      {
        title: i18next.t("general:Region"),
        dataIndex: "region",
        key: "region",
        width: "120px",
        sorter: (a, b) => a.region.localeCompare(b.region),
      },
      {
        title: i18next.t("general:Zone"),
        dataIndex: "zone",
        key: "zone",
        width: "120px",
        sorter: (a, b) => a.zone.localeCompare(b.zone),
      },
      {
        title: i18next.t("general:Category"),
        dataIndex: "category",
        key: "category",
        width: "120px",
        sorter: (a, b) => a.category.localeCompare(b.category),
      },
      {
        title: i18next.t("general:Type"),
        dataIndex: "type",
        key: "type",
        width: "120px",
        sorter: (a, b) => a.type.localeCompare(b.type),
      },
      {
        title: i18next.t("general:Size"),
        dataIndex: "size",
        key: "size",
        width: "120px",
        sorter: (a, b) => a.size.localeCompare(b.size),
      },
      {
        title: i18next.t("general:Image"),
        dataIndex: "image",
        key: "image",
        width: "120px",
        sorter: (a, b) => a.image.localeCompare(b.image),
      },
      {
        title: i18next.t("general:Public IP"),
        dataIndex: "publicIp",
        key: "publicIp",
        width: "120px",
        sorter: (a, b) => a.publicIp.localeCompare(b.publicIp),
      },
      {
        title: i18next.t("general:Private IP"),
        dataIndex: "privateIp",
        key: "privateIp",
        width: "120px",
        sorter: (a, b) => a.privateIp.localeCompare(b.privateIp),
      },
      {
        title: i18next.t("general:State"),
        dataIndex: "state",
        key: "state",
        width: "90px",
        sorter: (a, b) => a.state.localeCompare(b.state),
      },
      {
        title: i18next.t("general:Action"),
        dataIndex: "action",
        key: "action",
        width: "170px",
        fixed: (Setting.isMobile()) ? "false" : "right",
        render: (text, machine, index) => {
          return (
            <div>
              <Button
                style={{marginTop: "10px", marginBottom: "10px", marginRight: "10px"}}
                onClick={() => this.props.history.push(`/machines/${machine.owner}/${machine.name}`)}
              >{i18next.t("general:Edit")}
              </Button>
              <PopconfirmModal
                disabled={machine.owner !== this.props.account.owner}
                title={i18next.t("general:Sure to delete") + `: ${machine.name} ?`}
                onConfirm={() => this.deleteMachine(index)}
              >
              </PopconfirmModal>
            </div>
          );
        },
      },
    ];

    const paginationProps = {
      pageSize: this.state.pagination.pageSize,
      total: this.state.pagination.total,
      showQuickJumper: true,
      showSizeChanger: true,
      showTotal: () => i18next.t("general:{total} in total").replace("{total}", this.state.pagination.total),
    };

    return (
      <div>
        <Table scroll={{x: "max-content"}} columns={columns} dataSource={machines} rowKey={(machine) => `${machine.owner}/${machine.name}`} size="middle" bordered pagination={paginationProps}
          title={() => (
            <div>
              {i18next.t("general:Machines")}&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="primary" size="small" onClick={this.addMachine.bind(this)}>{i18next.t("general:Add")}</Button>
            </div>
          )}
          loading={this.state.loading}
          onChange={this.handleTableChange}
        />
      </div>
    );
  }

  fetch = (params = {}) => {
    let field = params.searchedColumn, value = params.searchText;
    const sortField = params.sortField, sortOrder = params.sortOrder;
    if (params.type !== undefined && params.type !== null) {
      field = "type";
      value = params.type;
    }
    this.setState({loading: true});
    MachineBackend.getMachines(Setting.getRequestOrganization(this.props.account), params.pagination.current, params.pagination.pageSize, field, value, sortField, sortOrder)
      .then((res) => {
        this.setState({
          loading: false,
        });
        if (res.status === "ok") {
          this.setState({
            data: res.data,
            pagination: {
              ...params.pagination,
              total: res.data2,
            },
            searchText: params.searchText,
            searchedColumn: params.searchedColumn,
          });
        } else {
          if (Setting.isResponseDenied(res)) {
            this.setState({
              isAuthorized: false,
            });
          } else {
            Setting.showMessage("error", res.msg);
          }
        }
      });
  };
}

export default MachineListPage;
