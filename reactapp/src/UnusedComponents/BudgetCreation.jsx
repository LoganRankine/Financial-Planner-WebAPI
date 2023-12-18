//import react, { children, component, usestate } from 'react';


//function directdebits() {
//    const [directdebitname, setdirectdebitname] = usestate("");
//    const [paymentdate, setpaymentdate] = usestate("");
//    const [interval, setinterval] = usestate("");
//    const [directdebitamount, setdebitamount] = usestate("");

//    const cars = ['ford', 'bmw', 'audi', 'vauxhaul', 'renault', 'seat'];

//    const column = (props) => {
//        return (
//            <div class="debit-detail-column">
//                <div class="debit-column-left">
//                    <a id="debit-name-title">{props.name}</a>
//                    <a id="debit-due-title">due date</a>
//                </div>
//                <div class="debit-column-right">
//                    <a id="debit-amount">due</a>
//                    <span id="debit-action-button" class="material-symbols-outlined">
//                        delete
//                    </span>

//                </div>
//            </div>
//        );
//    }

//    return (
//        <div class="account-creation-content">
//            <div class="debit-creation-content">
//                <div class="debit-detail-input">
//                    <div class="input-container">
//                        <label>direct debit name</label><br />
//                        <input type="text" value={directdebitname}
//                            onchange={(e) => setdirectdebitname(e.target.value)}
//                            class="input-box" />
//                    </div>
//                    <div class="input-container">
//                        <label>payment date</label><br />
//                        <input type="date" value={paymentdate}
//                            onchange={(e) => setpaymentdate(e.target.value)}
//                            class="input-box" />
//                    </div>
//                    <div class="input-container">
//                        <label>interval</label><br />
//                        <input type="date" value={interval}
//                            onchange={(e) => setinterval(e.target.value)}
//                            class="input-box" />
//                    </div>
//                    <div class="input-container">
//                        <label>amount</label><br />
//                        <input type="number" value={directdebitamount}
//                            onchange={(e) => setdebitamount(e.target.value)}
//                            class="input-box" />
//                    </div>
//                </div>
//                <div class="debit-details-display">
//                    {cars.map((car) => <column name={car} />)}
//                </div>
//            </div>
//            <div>
//                <div class="account-creation-footer">
//                    <div>
//                        <button title="save budget details and continue to main page" class="positive-button">save budget</button>
//                        <button title="save budget details and add direct debits" class="positive-button">add direct debit</button>
//                    </div>
//                    <div>
//                        <button title="skip first budget creation" class="negative-button">skip</button>
//                    </div>
//                </div>
//            </div>
//        </div>
//    );
//}
//export default directdebits;