import React from 'react';
import {
    BrowserRouter,
    Switch,
    Route,
    Link
  } from "react-router-dom";

class TestImageUpload extends React.Component {
    state = {
        url: '',
        file: null
    }

    onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
          this.setState({
            url: URL.createObjectURL(event.target.files[0]),
            file: event.target.files[0]
          });
        }
    }

    render() {
        const {url} = this.state;
        return(
                <>
                    <h1>Shop Management</h1>
                    <Switch>
                        <Route path="/shop/yourtours">
                            <div>Your Tours</div>
                        </Route >
                        <Route path="/shop/createtour" exact>
                            <div>Create New Tour</div>
                        </Route >
                        <Route path="/shop/yourorders" exact>
                            <div>Your Orders</div>
                        </Route >
                    </Switch>
                </>
        )
    }
}

// <div style={{width: "60%", margin: "0 auto"}}>
//                 <img style={{width: "300px", height:"300px", margin: "0 auto"}} src={url}>
                    
//                 </img>
//                 <input type="file" onChange={this.onImageChange}></input>
//             </div>

export default TestImageUpload;