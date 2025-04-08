import {useNavigate} from "react-router-dom";

export default function PaymentPage() {
    const navigate = useNavigate();
    const paymentProcess = async () => {
        const response = await fetch("http://localhost:5003/api/payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({  }),
        });
        const data = await response.json();
        localStorage.setItem("token", data.token);
        if (!response.ok) {
            alert(data.message);
        }
        if (response.ok) {
            alert("Successfully paid");
            navigate("/");
        }
    }
    
    return (
        <>
            <div className="container d-flex justify-content-center mt-5 mb-5">


                <div className="row g-3">

                    <div className="col-md-6">
                      
                        <span>Payment Method</span>
                        <div className="card">

                            <div className="accordion" id="accordionExample">

                                <div className="card">
                                    <div className="card-header p-0" id="headingTwo">
                                        <h2 className="mb-0">
                                            <button
                                                className="btn btn-light btn-block text-left collapsed p-3 rounded-0 border-bottom-custom"
                                                type="button" data-toggle="collapse" data-target="#collapseTwo"
                                                aria-expanded="false" aria-controls="collapseTwo">
                                                <div className="d-flex align-items-center justify-content-between">

                                                    <span>Paypal</span>
                                                    <img src="https://i.imgur.com/7kQEsHU.png" width="30"/>

                                                </div>
                                            </button>
                                        </h2>
                                    </div>
                                    <div id="collapseTwo" className="collapse" aria-labelledby="headingTwo"
                                         data-parent="#accordionExample">
                                        <div className="card-body">
                                            <input type="text" className="form-control" placeholder="Paypal email"/>
                                        </div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header p-0">
                                        <h2 className="mb-0">
                                            <button className="btn btn-light btn-block text-left p-3 rounded-0"
                                                    data-toggle="collapse" data-target="#collapseOne"
                                                    aria-expanded="true" aria-controls="collapseOne">
                                                <div className="d-flex align-items-center justify-content-between">

                                                    <span>Credit card</span>
                                                    <div className="icons">
                                                        <img src="https://i.imgur.com/2ISgYja.png" width="30"/>
                                                        <img src="https://i.imgur.com/W1vtnOV.png" width="30"/>
                                                        <img src="https://i.imgur.com/35tC99g.png" width="30"/>
                                                        <img src="https://i.imgur.com/2ISgYja.png" width="30"/>
                                                    </div>

                                                </div>
                                            </button>
                                        </h2>
                                    </div>

                                    <div id="collapseOne" className="collapse show" aria-labelledby="headingOne"
                                         data-parent="#accordionExample">
                                        <div className="card-body payment-card-body">

                                            <span className="font-weight-normal card-text">Card Number</span>
                                            <div className="input">

                                                <i className="fa fa-credit-card"></i>
                                                <input type="text" className="form-control"
                                                       placeholder="0000 0000 0000 0000"/>

                                            </div>

                                            <div className="row mt-3 mb-3">

                                                <div className="col-md-6">

                                                    <span className="font-weight-normal card-text">Expiry Date</span>
                                                    <div className="input">

                                                        <i className="fa fa-calendar"></i>
                                                        <input type="text" className="form-control"
                                                               placeholder="MM/YY"/>

                                                    </div>

                                                </div>


                                                <div className="col-md-6">

                                                    <span className="font-weight-normal card-text">CVC/CVV</span>
                                                    <div className="input">

                                                        <i className="fa fa-lock"></i>
                                                        <input type="text" className="form-control" placeholder="000"/>

                                                    </div>

                                                </div>


                                            </div>

                                            <span className="text-muted certificate-text"><i className="fa fa-lock"></i> Your transaction is secured with ssl certificate</span>

                                        </div>
                                    </div>
                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="col-md-6">
                        <span>Summary</span>

                        <div className="card">

                            <div className="d-flex justify-content-between p-3">

                                <div className="d-flex flex-column">

                                    <span>Pro(Billed Monthly) <i className="fa fa-caret-down"></i></span>
                                    <a href="#" className="billing">Save 20% with annual billing</a>

                                </div>

                                <div className="mt-1">
                                    <sup className="super-price">$9.99</sup>
                                    <span className="super-month">/Month</span>
                                </div>

                            </div>

                            <hr className="mt-0 line"/>

                            <div className="p-3">

                                <div className="d-flex justify-content-between mb-2">

                                    <span>Refferal Bonouses</span>
                                    <span>-$2.00</span>

                                </div>

                                <div className="d-flex justify-content-between">

                                    <span>Vat <i className="fa fa-clock-o"></i></span>
                                    <span>-20%</span>

                                </div>


                            </div>

                            <hr className="mt-0 line"/>


                            <div className="p-3 d-flex justify-content-between">

                                <div className="d-flex flex-column">

                                    <span>Today you pay(US Dollars)</span>
                                    <small>After 30 days $9.59</small>

                                </div>
                                <span>$0</span>


                            </div>


                            <div className="p-3">

                                <button className="btn btn-primary btn-block free-button">Try it free for 30 days
                                </button>
                                <div className="text-center">
                                    <a href="#">Have a promo code?</a>
                                </div>

                            </div>


                        </div>
                    </div>

                </div>


            </div>
        </>
    )
}