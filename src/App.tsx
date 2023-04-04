import './App.css';
import Navbar from './Navbar';
import Footer from "./components/Footer";
import YO from "./components/views/YO/YO";
import Kauppis from "./components/views/Kauppis";
import Laakis from "./components/views/Laakis";
import ViewSwitcher, {ViewData} from "./components/ViewSwitcher";
import React from "react";
import PageSection from "./components/PageSection";
import YODataParser from "./components/data/YODataParser";

export default class App extends React.Component {

  private DEFAULT_VIEW = "YO";

  private DATA_PARSERS = {
    "YO": new YODataParser()
  }

  private views: ViewData[] = [
    {
      name: "YO",
      element: <YO yoDataParser={this.DATA_PARSERS["YO"]}/>,
      icon: "",
      color: "#b698d9"
    },
    {
      name: "Kauppis",
      element: <Kauppis/>,
      icon: "",
      color: "#5b967a"
    },
    {
      name: "Lääkis",
      element: <Laakis/>,
      icon: "",
      color: "#e14444"
    },
    {
      name: "DI",
      element: <div/>,
      icon: "",
      color: "#b698d9"
    }
  ];

  state: {
    examBgColor: string
  }

  constructor(props) {
    super(props);
    this.state = {
      examBgColor: this.views.find(view => view.name === this.DEFAULT_VIEW).color
    }
  }

  private onViewSwitch(viewData: ViewData) {
    this.setState({
      examBgColor: viewData.color
    })
  }

  render() {
    return (
      <div className="App">
        <Navbar/>
        <div className="Content">
          <p className={"intro-text"}>
            Koetilastot tarjoaa tilastoja yo- ja pääsykokeiden tuloksien kehityksestä ja arvosanajakaumista. Tiedot
            päivitetään automaattisesti Ylioppilastutkintolautakunnan verkkosivustolta.
          </p>
          <PageSection backgroundColor={this.state.examBgColor}>
            <ViewSwitcher views={this.views} currentView={"YO"} onViewSwitch={this.onViewSwitch.bind(this)}/>
          </PageSection>
          <Footer previousColor={this.state.examBgColor}/>
        </div>
      </div>
    );
  }
}
