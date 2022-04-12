import React from "react";
import Header from "./Header/Header";
import TourCard from "./TourCard";
import axios from "axios";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { toast } from "react-toastify";
import ReactLoading from "react-loading";
import { Pagination } from "@mui/material";
import { FaCaretDown } from "react-icons/fa";
import "../Styles/tours-page.scss";

class ToursPage extends React.Component {
    state = {
        tours: [],
        totalPage: 2,
        totalCount: 18,
        page: 1,
        perPage: 12,
        sort: "latest",
        isShowSortMenu: false,
        isLoading: false,
    };

    filter = this.props.location.state
        ? this.props.location.state.filter
        : {
              selectedPlace: null,
              startDate: new Date(),
              endDate: new Date(),
              keyword: "",
              priceRange: [0, 3000],
              selectedCategories: [],
              isPrivate: false,
              matchAll: false,
          };

    baseUrl = this.props.reduxData.baseUrl;

	async fetchData(filter, sort, page, perPage) {
		try {
            this.setState({
                isLoading: true,
            });
            var params = new URLSearchParams();
            params.append("placeId", filter.selectedPlace ? filter.selectedPlace.id : 0);
            params.append("privateOnly", filter.isPrivate);
            params.append("keyword", filter.keyword);
            params.append("duration", Math.ceil(Math.abs(filter.endDate - filter.startDate) / (1000 * 60 * 60 * 24)));
            params.append("minPrice", filter.priceRange[0]);
            params.append("maxPrice", filter.priceRange[1]);
            filter.selectedCategories.forEach((item) => {
                params.append("categoryIds", item.id);
            });
            params.append("matchAll", filter.matchAll);
            params.append("sort", sort);
            params.append("page", page);
            params.append("perPage", perPage);

            let res = await axios.get(`${this.baseUrl}/api/Tours`, {
                params: params,
            });
            //console.log(res);
            const resTour = res.data.items;
            this.setState({
                tours: resTour,
                totalPage: res.data.totalPage,
                totalCount: res.data.totalCount,
				page: page,
				sort: sort
            });
        } catch (error) {
            if (!error.response) {
                toast.error("Network error");
                // fake api response
                const resTours = listTours.slice(
                    (page - 1) * perPage,
                    (page - 1) * perPage + perPage
                );
                this.setState({
                    tours: resTours,
                });

                return;
            }
            if (error.response.status === 404) {
                console.log(error);
            }
            if (error.response.status === 400) {
                console.log(error);
            }
        } finally {
            setTimeout(() => {
                this.setState({
                    isLoading: false,
                });
            }, 1000);
        }
	}

    async componentDidMount() {
        const { page, perPage, sort } = this.state;
        // call api to get tours and set state
		this.fetchData(this.filter, sort, page, perPage)
    }

    async componentDidUpdate(prevProps, prevState) {
        // if get a new filter, fetch api with the new filter
        // and set 'page' to 1
        if (prevProps.location.key !== this.props.location.key) {
            // reset the filter
            this.filter = this.props.location.state.filter;
            const { perPage } = this.state;
            // call api to get tours and set state
            this.fetchData(this.filter, "latest", 1, perPage)           
            this.scrollToMainContent();
        }
        // when page change
        if (prevState.page !== this.state.page && prevState.tours === this.state.tours) {
            const { page, perPage, sort } = this.state;
            // call api to get tours and set state
            this.fetchData(this.filter, sort, page, perPage)                   
        }
        // when sort option change
        if (prevState.sort !== this.state.sort) {
            const { perPage, sort } = this.state;
            // call api to get tours and set state
            this.fetchData(this.filter, sort, 1, perPage)  
            this.scrollToMainContent();
        }
    }

    scrollToMainContent = () => {
        const element = document.getElementById("tour-page-container");
        element.scrollIntoView({ behavior: "smooth" });
    };

    // toggle sort menu
    handleToggleSortMenu = () => {
        const isShowSortMenu = this.state.isShowSortMenu;
        this.setState({
            isShowSortMenu: !isShowSortMenu,
        });
    };

    // change sort option
    handleSortOptionChange = (event) => {
        this.setState({
            sort: event.target.value,
            isShowSortMenu: false,
        });
    };

    // change page
    handleOnChangePage = (event, page) => {
        this.setState({
            page: page,
        });
    };

    render() {
        console.log("filter: ", this.props.location.state.filter);
        const { tours, totalCount, page, totalPage } = this.state;
        const filter = this.filter;
        const selectedPlace = filter.selectedPlace;
        const { sort, isShowSortMenu, isLoading } = this.state;
		const baseUrl = this.baseUrl;
        return (
            <div className="App">
                <Header filter={filter} isSmall={true} />
                {/* check if list tours empty here */}
				{
					isLoading ? 
                    <div className="loading-container">
                        <ReactLoading
                            className="loading-component"
                            type={"spin"}
                            color={"#df385f"}
                            height={50}
                            width={50}
                        />
                    </div>
					:
					<div className="tour-page-container" id="tour-page-container">
						<div className="header">
							{
								// if selectedPlace not null
								selectedPlace &&
								!(
									Object.keys(selectedPlace).length === 0 &&
									selectedPlace.prototype === Object
								) ? (
									<h3 className="result-text">
										{selectedPlace.placeName}: {totalCount}{" "}
										tours found!
									</h3>
								) : (
									<h3 className="result-text">
										{" "}
										{totalCount} tours found!
									</h3>
								)
							}
							<div className="sort-container">
								<span
									className="sort-btn"
									onClick={this.handleToggleSortMenu}
								>
									Sort <FaCaretDown />
								</span>
								{isShowSortMenu && (
									<div className="sort-option-list">
										<h3 className="sort-title">SORT BY</h3>
										<form className="sort-form">
											<span className="sort-sub-title">
												New Tours
											</span>
											<div className="sort-form-group">
												<input
													type="radio"
													id="latest"
													name="sort"
													value="latest"
													checked={sort === "latest"}
													onChange={(event) =>
														this.handleSortOptionChange(
															event
														)
													}
												/>
												<label htmlFor="latest">
													Latest
												</label>
											</div>
											<span className="sort-sub-title">
												Price
											</span>
											<div className="sort-form-group">
												<input
													type="radio"
													id="price-up"
													name="sort"
													value="price-up"
													checked={sort === "price-up"}
													onChange={(event) =>
														this.handleSortOptionChange(
															event
														)
													}
												/>
												<label htmlFor="price-up">
													Low to High
												</label>
											</div>
											<div className="sort-form-group">
												<input
													type="radio"
													id="price-down"
													name="sort"
													value="price-down"
													checked={sort === "price-down"}
													onChange={(event) =>
														this.handleSortOptionChange(
															event
														)
													}
												/>
												<label htmlFor="price-down">
													High to Low
												</label>
											</div>
											<span className="sort-sub-title">
												Rating
											</span>
											<div className="sort-form-group">
												<input
													type="radio"
													id="rating"
													name="sort"
													value="rating"
													checked={sort === "rating"}
													onChange={(event) =>
														this.handleSortOptionChange(
															event
														)
													}
												/>
												<label htmlFor="rating">
													Highest
												</label>
											</div>
										</form>
									</div>
								)}
							</div>
						</div>
						<div className="list-tours">
							{tours.map((item) => {
								return (
									<TourCard
										tour={item}
										key={item.id}
										baseUrl={baseUrl}
										isSlideItem={false}
									/>
								);
							})}
						</div>
						{totalPage > 1 && (
							<div className="pagination-container">
								<Pagination
									count={totalPage}
									shape="rounded"
									siblingCount={1}
									page={page}
									onChange={(event, page) =>
										this.handleOnChangePage(event, page)
									}
								/>
							</div>
						)}
					</div>
				}
            </div>
        );
    }
}

const listTours = [
    {
        id: 1,
        tourName: "FULL-DAY HAI VAN PASS & LANG CO BEACH & IN HUE CITY",
        reviews: 10,
        rating: 4.8,
        viewCount: 10,
        isPrivate: false,
        minPrice: 384,
        duration: 1,
        route: "london",
        description: "For everything hunky-dory",
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2019/12/LANG-CO-BEACH-10.jpg",
    },
    {
        id: 2,
        tourName:
            "HALF-DAY FOODIE TOUR BY BICYCLE & VISIT TRA QUE VEGETABLE VILLAGE",
        reviews: 10,
        rating: 4.4,
        viewCount: 10,
        isPrivate: false,
        minPrice: 45,
        duration: 0.5,
        route: "las-vegas",
        description: "An offer you can't refuse",
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2019/12/Foodie_11-680x500.jpg",
    },
    {
        id: 3,
        tourName: "HOI AN MYSTERIOUS NIGHT TOUR WITH DINNER FROM DA NANG",
        reviews: 10,
        rating: 3.8,
        viewCount: 10,
        isPrivate: true,
        minPrice: 46,
        duration: 0.16666666,
        route: "rome",
        description: "Roam the eternal city",
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2019/12/1-25-870x555.jpg",
    },
    {
        id: 4,
        tourName: "HOI AN COUNTRYSIDE ADVENTURE BY ELECTRIC SCOOTER",
        reviews: 10,
        rating: 4.2,
        viewCount: 10,
        isPrivate: false,
        minPrice: 62,
        duration: 0.5,
        route: "paris",
        description: "C'est La Vie",
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2019/12/1-Briefing-Hoi-An-Town-6-870x555.jpg",
    },
    {
        id: 5,
        tourName: "Private Tour: FULL-DAY GOLF TOUR FROM HA NOI",
        reviews: 10,
        rating: 4.6,
        viewCount: 10,
        isPrivate: true,
        minPrice: 100,
        duration: 0.33333333,
        route: "new-york",
        description: "Take a bite of the Big Apple",
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2019/12/GOLF_6-680x500.jpg",
    },
    {
        id: 6,
        tourName: "13 DAYS AUTHENTIC VIETNAM PLUS GOLDEN BRIDGE",
        reviews: 10,
        rating: 4.6,
        viewCount: 10,
        isPrivate: false,
        minPrice: 200,
        duration: 13,
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2019/12/GBS0056_13days9-680x500.jpg",
    },
    {
        id: 7,
        tourName:
            "HALF-DAY FOODIE TOUR BY BICYCLE & VISIT TRA QUE VEGETABLE VILLAGE",
        reviews: 10,
        rating: 4.4,
        viewCount: 10,
        isPrivate: true,
        minPrice: 32,
        duration: 0.5,
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2019/12/Hoi-An-Food-tour-by-bike-_7-1-680x500.jpg",
    },
    {
        id: 8,
        tourName: "HALF-DAY DA NANG MUSEUMS AND BRIDGES TOUR",
        reviews: 10,
        rating: 4.8,
        viewCount: 10,
        isPrivate: false,
        minPrice: 35,
        duration: 0.5,
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2019/12/HCM-MUSEUM_49-680x500.jpg",
    },
    {
        id: 9,
        tourName: "FULL-DAY DMZ TOUR FROM HUE CITY",
        reviews: 10,
        rating: 4.8,
        viewCount: 10,
        isPrivate: false,
        minPrice: 89,
        duration: 1,
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2021/06/1-680x500.jpg",
    },
    {
        id: 10,
        tourName: "BA NA HILLS AND GOLDEN BRIDGE FROM CHAN MAY PORT",
        reviews: 10,
        rating: 4.2,
        viewCount: 10,
        isPrivate: false,
        minPrice: 100,
        duration: 0.29166666,
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2019/12/BA-NA-HILLS_44-1-680x500.jpg",
    },
    {
        id: 11,
        tourName: "Private Tour: HUE HERITAGE",
        reviews: 10,
        rating: 3.8,
        viewCount: 10,
        isPrivate: true,
        minPrice: 1.043,
        duration: 2,
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2019/12/HUE-CITY-_6-680x500.jpg",
    },
    {
        id: 12,
        tourName: "FOOD TOUR IN HUE CITY",
        reviews: 10,
        rating: 4.4,
        viewCount: 10,
        isPrivate: true,
        minPrice: 162,
        duration: 0.16666666,
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2021/08/Food-Tour-Hue_4-680x500.jpg",
    },
    {
        id: 13,
        tourName: "FOOD TOUR IN HUE CITY",
        reviews: 10,
        rating: 4.8,
        viewCount: 10,
        isPrivate: false,
        minPrice: 63,
        duration: 2,
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2021/06/dnp-Top-10-mon-an-vat-ngon-nhat-o-hue-banh-be%CC%80o-870x555.jpeg",
    },
    {
        id: 14,
        tourName: "HOIANIAN’S BELIEFS AND VEGETARIAN DINNER FROM HOI AN",
        reviews: 10,
        rating: 3.8,
        viewCount: 10,
        isPrivate: true,
        minPrice: 46,
        duration: 0.16666666,
        thumbnailPath:
            "https://cdn-imgix.headout.com/cities/edinburgh/images/mobile/morning.jpg?auto=compress&fm=webp&w=412.5&h=486&crop=faces&fit=min",
    },
    {
        id: 15,
        tourName: "FULL-DAY HUE CITY TOUR & CRAFT VILLAGES",
        reviews: 10,
        rating: 4.8,
        viewCount: 10,
        isPrivate: false,
        minPrice: 79,
        duration: 2,
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2021/06/Screen-Shot-2021-05-23-at-08.47.26-680x500.png",
    },
    {
        id: 16,
        tourName: "Private Tour: HALF-DAY COUNTRYSIDE BY BICYCLE FROM HUE CITY",
        reviews: 10,
        rating: 4.8,
        viewCount: 10,
        isPrivate: true,
        minPrice: 174,
        duration: 0.16666666,
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2021/08/Food-Tour-Hue_5-680x500.jpg",
    },
    {
        id: 17,
        tourName: "Private Tour: FULL-DAY HUE CITY TOUR & CRAFT VILLAGES",
        reviews: 10,
        rating: 4.8,
        viewCount: 10,
        isPrivate: true,
        minPrice: 307,
        duration: 1,
        route: "florence",
        description: "Enjoy and have fun in the City",
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2021/08/Hue_18-680x500.jpg",
    },
    {
        id: 18,
        tourName: "Private Tour: THREE-DAY DA LAT FLOWER & WATERFALL CITY",
        reviews: 10,
        rating: 4.8,
        viewCount: 10,
        isPrivate: true,
        minPrice: 1.223,
        duration: 3,
        route: "florence",
        description: "Enjoy and have fun in the City",
        thumbnailPath:
            "https://hoianexpress.com.vn/wp-content/uploads/2019/12/hinh-anh-da-lat-5-680x500.jpg",
    },
];

const mapStateToProps = (state) => {
    return {
        reduxData: state,
    };
};

export default connect(mapStateToProps)(withRouter(ToursPage));
