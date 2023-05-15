import axios from "axios";
import { useCallback } from "react";
import './App.css'
import useRazorpay from "react-razorpay";

export default function App() {
  const Razorpay = useRazorpay();

  const handlePayment = useCallback(async (e) => {
    e.preventDefault();
    const amount = document.getElementById('amount').value;
    if (!amount || amount === 0) return;


    const order = await axios.post(
      "http://localhost:5000/checkout",
      { amount }
    );
    console.log(order.data)

    const options = {
      key: "rzp_test_MGXnCHl0hEQXuC",
      amount: order.data.amount,
      currency: "INR",
      name: "Satyam Shop",
      description: "This is a test Transaction",
      order_id: order.data.id,
      handler: async (response) => {
        try {
          const res = await axios.post('http://localhost:5000/verify', { response })
          console.log(res.data)
          document.getElementById('amount').value = ""
        } catch (error) {
          console.log(error)
        }
      },
      prefill: {
        name: "Satyam Mishra",
        email: "satyambhai32h5@gmail.com",
        contact: "8252xxxxx",
      },
      notes: {
        address: "Test Satyam Shop",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzpay = new Razorpay(options);
    rzpay.open();
  }, [Razorpay]);

  return (
    <form className="payContainer">
      <div className="inputContainer">
        <input type="number" id="amount" placeholder="Enter Amount (In Rs)" />
      </div>
      <button onClick={handlePayment} className="payBtn">Pay Now </button>
    </form>
  );
}