import React from 'react'
import address from '../Utilities/address.js'
import { toast } from 'react-toastify';
import '../Styles/place-picker.scss'

class PlacePicker extends React.Component {
    state = {
        province: null,
        district: null,
        ward: null,
        place: '',
        isShow: ''
    }

    processPlace = (placeName) => {
        if(placeName.includes("Tỉnh")) {
            placeName = placeName.replace("Tỉnh ", "") + " Province";
        }
        if(placeName.includes("Thành phố")) {
            placeName = placeName.replace("Thành phố ", "") + " City";
        }
        if(placeName.includes("Thị xã")) {
            placeName = placeName.replace("Thị xã ", "") + " Town";
        }
        if(placeName.includes("Quận") || placeName.includes("Huyện")) {
            placeName = placeName.replace("Quận ", "").replace("Huyện ", "").replace("Thị xã ", "") + " District";
        }
        if(placeName.includes("Phường") || placeName.includes("Xã") || placeName.includes("Thị trấn")) {
            placeName = placeName.replace("Phường ", "").replace("Xã ", "").replace("Thị trấn ", "") + " Ward";
        }
        return placeName;
    }

    removeVietnameseTones = (str) => {
        str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g,"a"); 
        str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g,"e"); 
        str = str.replace(/ì|í|ị|ỉ|ĩ/g,"i"); 
        str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g,"o"); 
        str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g,"u"); 
        str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g,"y"); 
        str = str.replace(/đ/g,"d");
        str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
        str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
        str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
        str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
        str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
        str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
        str = str.replace(/Đ/g, "D");
        // Some system encode vietnamese combining accent as individual utf-8 characters
        // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
        str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
        str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
        // Remove extra spaces
        // Bỏ các khoảng trắng liền nhau
        str = str.replace(/ + /g," ");
        str = str.trim();
        // Remove punctuations
        // Bỏ dấu câu, kí tự đặc biệt
        str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g," ");
        return str;
    }

    // on click menu
    handleOpenProvinceMenu = () => {
        let isShow = this.state.isShow;
        isShow = isShow==='province' ? '' : 'province';
        this.setState({
            isShow: isShow
        })
    }
    handleOpenDistrictMenu = () => {
        let isShow = this.state.isShow;
        isShow = isShow==='district' ? '' : 'district';
        this.setState({
            isShow: isShow
        })
    }
    handleOpenWardMenu = () => {
        let isShow = this.state.isShow;
        isShow = isShow==='ward' ? '' : 'ward';
        this.setState({
            isShow: isShow
        })
    }

    // on click province
    handleProvinceSelect = (item) => {
        this.setState({
            province: {
                Id: item.Id,
                Name: this.removeVietnameseTones(this.processPlace(item.Name))
            },
            district: null,
            ward: null,
            isShow: 'district'
        })
    }

    // on click district
    handleDistrictSelect = (item) => {
        this.setState({
            district: {
                Id: item.Id,
                Name: this.removeVietnameseTones(this.processPlace(item.Name))
            },
            ward: null,
            isShow: 'ward'
        })
    }

    // on click ward
    handleWardSelect = (item) => {
        this.setState({
            ward: {
                Id: item.Id,
                Name: this.removeVietnameseTones(this.processPlace(item.Name))
            }     
        })
        let place = `${this.removeVietnameseTones(this.processPlace(item.Name))}, ${this.state.district.Name}, ${this.state.province.Name}`;
        //console.log('place', place);
        this.props.onPlacePick(place);
    }

    render() {
        const { province, district, ward, isShow} = this.state;
        return (
            <div className="address-picker">
                <div className='province' id="province" onClick={this.handleOpenProvinceMenu}>
                    <span className='title'>{province ? province.Name : 'Province'}</span>       
                    {
                        isShow === 'province' &&
                        <ul className='list' onClick={(event) => event.stopPropagation()}>
                            {
                                address.map((item) => {
                                    return(
                                        <li key={item.Id} className="item" onClick={()=>this.handleProvinceSelect(item)}>{item.Name}</li>
                                    )
                                })
                            }
                        </ul>
                    }
                </div>
                <div className='district' id="district" onClick={this.handleOpenDistrictMenu}>
                    <span className='title'>{district ? district.Name : 'District'}</span> 
                    {
                        province && isShow === 'district' &&
                        <ul className='list' onClick={(event) => event.stopPropagation()}>
                        {
                            address.find(x => x.Id === province.Id).Districts.map((item) => {
                                return(
                                    <li key={item.Id} className="item" onClick={()=>this.handleDistrictSelect(item)}>{item.Name}</li>
                                )
                            })
                        }
                        </ul>
                    }
                </div>
                <div className='ward' id="ward" onClick={this.handleOpenWardMenu}>
                    <span className='title'>{ward ? ward.Name : 'Ward'}</span> 
                    {
                        district && isShow === 'ward' &&
                        <ul className='list'>
                        {
                            address.find(x => x.Id === province.Id).Districts.find(x => x.Id === district.Id).Wards.map((item) => {
                                return(
                                    <li key={item.Id} className="item" onClick={()=>this.handleWardSelect(item)}>{item.Name}</li>
                                )
                            })
                        }
                        </ul>
                    }
                </div>
            </div>
        )
    }
}

export default PlacePicker;