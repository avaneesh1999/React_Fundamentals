import React, { Component } from "react";
//import { getMovies } from "./MovieService";
import axios from "axios";

export default class Movies extends Component {
  constructor(props) {
    super(props);

    //all permanent operations are used through state:-Delete
    this.state = {
      movies: [],
      currsearchtext: "",
      currpage: 1,
      genres: [{ _id: "abcd", name: "All Genres" }],
      cGenre: "All Genres",
    };
  }

  //network request

  async componentDidMount() {
    console.log("Component DID Mount");
    let res = await axios.get(
      "https://backend-react-movie.herokuapp.com/movies"
    );
    let genreRes = await axios.get(
      "https://backend-react-movie.herokuapp.com/genres"
    );
    console.log(res.data.movies);
    console.log(genreRes.data.genres);
    this.setState({
      movies: res.data.movies,
      //spread operator adds this generes to state generes
      genres: [...this.state.genres, ...genreRes.data.genres],
    });
  }

  handledelete = (id) => {
    let filteredarr = this.state.movies.filter((movieobj) => {
      return movieobj._id !== id;
    });
    this.setState({
      movies: filteredarr,
    });
  };

  handlechange = (e) => {
    let val = e.target.value;
    this.setState({
      currsearchtext: val,
    });
  };
  //hjgskc

  sortbyStocks = (e) => {
    let className = e.target.className;
    let stocksarr = [];
    if (className == "fa fa-sort-asc") {
      stocksarr = this.state.movies.sort(function (movieobja, movieobjb) {
        return movieobja.numberInStock - movieobjb.numberInStock;
      });
    } else if (className == "fa fa-sort-desc") {
      stocksarr = this.state.movies.sort(function (movieobja, movieobjb) {
        return movieobjb.numberInStock - movieobja.numberInStock;
      });
    }

    this.setState({
      movies: stocksarr,
    });
  };

  sortbyRatings = (e) => {
    let className = e.target.className;
    let stocksarr = [];
    if (className == "fa fa-sort-asc") {
      stocksarr = this.state.movies.sort(function (movieobja, movieobjb) {
        return movieobja.dailyRentalRate - movieobjb.dailyRentalRate;
      });
    } else if (className == "fa fa-sort-desc") {
      stocksarr = this.state.movies.sort(function (movieobja, movieobjb) {
        return movieobjb.dailyRentalRate - movieobja.dailyRentalRate;
      });
    }

    this.setState({
      movies: stocksarr,
    });
  };

  handlepageChange = (pagenumber) => {
    this.setState({
      currpage: pagenumber,
    });
  };

  handlegenre=(genre)=>{
    this.setState({
      cGenre:genre
    })
  }

  render() {
    console.log("render");
    //searching is temporary operations thats why we created local variable Filtered Movies here
    let { movies, currsearchtext, currpage,genres,cGenre} = this.state;
    let FilteredMovies = [];

    //pagenation

    if (currsearchtext !== "") {
      FilteredMovies = movies.filter((movieobj) => {
        let title = movieobj.title.trim().toLowerCase();
        return title.includes(currsearchtext.toLowerCase());
      });
    } else {
      FilteredMovies = movies;
    }

    //GenreFilter

    if(cGenre!='All Genres'){
      FilteredMovies=FilteredMovies.filter(function(movieobj){
        return movieobj.genre.name==cGenre
      })    }

    

    let limit = 4;
    let pagenumber = Math.ceil(FilteredMovies.length / limit);
    let pagenumberArr = [];

    for (let i = 0; i < pagenumber; i++) {
      pagenumberArr.push(i + 1);
    }

    let si = (currpage - 1) * limit;
    let ei = si + limit;

    FilteredMovies = FilteredMovies.slice(si, ei);


    
    return (
      <>
      {this.state.movies.length == 0 ? <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
      </div> :
        <div className="row">
          <div className="col-3">
            <ul className="list-group">
              {
                genres.map(genresObj=>(
                  <li onClick={()=>this.handlegenre(genresObj.name)} key={genresObj._id} className="list-group-item">{genresObj.name}</li>
                ))
              }
            </ul>

            <h5>Current GENRE:{cGenre}</h5>
          </div>
          <div className="col-9">
            <input type="search" onChange={this.handlechange}></input>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Title</th>
                  <th scope="col">Genre</th>
                  <th scope="col">
                    <i
                      className="fa fa-sort-asc"
                      onClick={this.sortbyStocks}
                      aria-hidden="true"
                    ></i>
                    Stock
                    <i
                      className="fa fa-sort-desc"
                      onClick={this.sortbyStocks}
                      aria-hidden="true"
                    ></i>
                  </th>
                  <th scope="col">
                    <i
                      className="fa fa-sort-asc"
                      onClick={this.sortbyRatings}
                      aria-hidden="true"
                    ></i>
                    Rate
                    <i
                      className="fa fa-sort-desc"
                      onClick={this.sortbyRatings}
                      aria-hidden="true"
                    ></i>
                  </th>
                </tr>
              </thead>
              <tbody>
                {
                  //
                  FilteredMovies.map((movieobj) => (
                    <tr scope="row">
                      <td>{movieobj.title}</td>
                      <td>{movieobj.genre.name}</td>
                      <td>{movieobj.numberInStock}</td>
                      <td>{movieobj.dailyRentalRate}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => this.handledelete(movieobj._id)}
                          className="btn btn-danger"
                        >
                          Danger
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
            <nav aria-label="...">
              <ul className="pagination">
                {pagenumberArr.map((pagenumber) => {
                  let classStyle =
                    pagenumber == currpage ? "page-item active" : "page-item";
                  return (
                    <li
                      onClick={() => this.handlepageChange(pagenumber)}
                      className={classStyle}
                    >
                      <span className="page-link">{pagenumber}</span>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
  }  
      </>
    );
  }
}

{
  /* <li class="page-item"><a class="page-link" href="#">1</a></li>
<li class="page-item active" aria-current="page">
  <a class="page-link" href="#">2</a>
</li>
<li class="page-item"><a class="page-link" href="#">3</a></li> */
}
