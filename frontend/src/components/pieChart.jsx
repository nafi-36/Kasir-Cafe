import React from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";

export default class PieChart extends React.Component {
  constructor() {
    super();
    this.state = {
      menus: [],
      nama_menu: [],
      qty: [],
    };
  }

  getMenuFavorite = () => {
    let url = "http://localhost:9090/menu/search/favorite";

    axios.get(url)
      .then((res) => {
        this.setState({
          menus: res.data.menu,
          nama_menu: res.data.menu.map((item) => item.menu.nama_menu),
          qty: res.data.menu.map((item) => item.total_penjualan),
        });
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  componentDidMount() {
    this.getMenuFavorite();
  }

  render() {
    const data = {
      labels: this.state.nama_menu,
      datasets: [
        {
          data: this.state.qty,
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#FF8C00",
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
            "#4BC0C0",
            "#FF8C00",
          ],
        },
      ],
    };

    const options = {
      title: {
        display: true,
        text: "Pie Chart Penjualan Menu",
      },
    };

    return (
      <div>
        <Pie data={data} options={options} />
      </div>
    );
  }
}
