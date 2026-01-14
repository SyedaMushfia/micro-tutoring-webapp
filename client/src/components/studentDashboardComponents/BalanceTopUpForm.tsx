import React, { useState, type ChangeEvent, type FormEvent } from 'react'
import { useAppContext } from '../../context/AppContext';
import axios from 'axios';
import { usePaymentInputs } from "react-payment-inputs";

interface TopUpFormProps {
  onRecharge: (amount: number) => void;
}

function BalanceTopUpForm() {
  const { getCardNumberProps, getExpiryDateProps, getCVCProps } = usePaymentInputs();
  const { userData, backendUrl, setUserData } = useAppContext();
  const [saveCard, setSaveCard] = useState(false);
  const savedCard = userData?.student?.savedCard;
  const hasSavedCard = Boolean(savedCard);

  const [formData, setFormData] = useState({
    cardName: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
    amount: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; 

    setFormData((prev) => ({
        ...prev,
        [name]: value,
    }));

    if (
        (hasSavedCard || (formData.cardName && formData.cardNumber && formData.expiry && formData.cvc)) &&
        formData.amount
    ) {
        setError("");
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!hasSavedCard) {
        if (!formData.cardName || !formData.cardNumber || !formData.expiry || !formData.cvc ) {
            setError("Please enter valid card details.");
            return;
        }

        if (!formData.amount) {
            setError("Please enter an amount.");
            return;
        }

        if (!saveCard) {
            setError("You must agree to save your card details.");
            return;
        }
    }

    const amount = Number(formData.amount);

    if (amount <= 0) {
        setError("Please enter a valid amount.");
        return;
    }

    try {
        const payload = {
            cardName: formData.cardName,
            cardNumber: formData.cardNumber,
            expiry: formData.expiry,
            amount,
        }

        const response = await axios.post(`${backendUrl}/api/recharge/top-up`, payload, {withCredentials: true});

        if (response.data.success) {
            const updatedBalance = response.data.newBalance;

            setUserData((prev: any) => ({
                ...prev,
                student: {
                ...prev.student,
                balance: updatedBalance,
                savedCard: prev.student.savedCard ?? {
                    cardName: formData.cardName,
                    cardNumber: response.data.recharge.cardNumber,
                    expiry: formData.expiry
                }
                }
            }));

            setFormData({ cardName: "", cardNumber: "", expiry: "", cvc: "", amount: "" });
        } else {
            setError(response.data?.message);
        }
    } catch (error: any) {
        console.error(error);
        setError(error.response?.data?.message || "Server error, try again later.");
    }
  }


  return (
    <div className='bg-[#f2f4fc] md:w-[35vw] h-[600px] shadow-lg sm:px-[5%] xs:px-[10%] mt-4 rounded-2xl'>
        <div className='flex flex-col justify-center items-center h-[100px]'>
            <h1 className="lg:text-text2 md:text-[22px] xs:text-text2 text-center text-[#2e294e] font-semibold mt-6">Recharge your Account</h1>
            <div className="text-sm text-gray-500 text-center">
                This is a simulated card input. No real card details are stored.
            </div>
            {error && (
                <div className="p-2 text-red-600 text-[12px]">
                    {error}
                </div>
            )}
        </div>
        <form className="space-y-4 mt-8 flex flex-col items-center" onSubmit={handleSubmit}>
        {userData?.student?.savedCard ? (
        <div className='flex flex-col items-center'>
        <div>
            <div className="sm:w-[50vw] xs:w-[60vw] md:w-[25vw] mb-6 h-56 rounded-2xl p-6 text-white bg-gradient-to-br from-[#2e294e] via-[#675cae] to-[#b9b2ff] shadow-xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-black/10 rounded-full" />
                <div className="w-12 h-9 bg-yellow-300/80 rounded mb-6"></div>
                <p className="absolute top-6 right-6 text-lg font-bold tracking-wider">VISA</p>
            <p className="text-xl tracking-widest mt-8 mb-6 font-semibold">{userData.student.savedCard.cardNumber}</p>
            <div className='flex justify-between items-end text-sm'>
                <div>
                    <p className='uppercase text-[10px] opacity-80'>CARD HOLDER</p>
                    <p className="font-medium">{userData.student.savedCard.cardName}</p>
                </div>
                <div className="text-right">
                    <p className="uppercase text-[10px] opacity-80">EXPIRES</p>
                    <p className="font-medium">{userData.student.savedCard.expiry}</p>
                </div>
            </div>
            </div>
        </div>
        <div className="mt-2 sm:w-[50vw] md:w-[25vw] xs:w-[60vw]">
                <input
                type="number"
                name='amount'
                placeholder='Amount'
                value={formData.amount}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-4"
                />
        </div>
        </div>
        ) : (   
            <>
            <div>
            <input
              type="text"
              name='cardName'
              placeholder='Card Name'
              value={formData.cardName}
              onChange={handleChange}
              className="xs:w-[70vw] md:w-[28vw] p-2 border rounded mb-4"
            />
            </div>
            <div>
                <input
                {...getCardNumberProps({
                    value: formData.cardNumber,
                    onChange: handleChange,
                })}
                name="cardNumber"
                className="xs:w-[70vw] md:w-[28vw] p-2 border rounded mb-4"
                />
            </div>
            <div className="flex space-x-2">
            <div className='flex flex-col'>
                <input
                    {...getExpiryDateProps({
                    onChange: handleChange,
                    })}
                    value={formData.expiry}
                    name="expiry"
                    className="xs:w-[34vw] md:w-[13.5vw] p-2 border rounded mb-4"
                />
            </div>
            <div className='flex flex-col'>
                <input
                    {...getCVCProps({
                    onChange: handleChange,
                    })}
                    value={formData.cvc}
                    name="cvc"
                    className="xs:w-[34vw] md:w-[14vw] p-2 border rounded mb-4"
                />
            </div>
            </div>
            <div>
                <input
                type="number"
                name='amount'
                placeholder='Amount'
                value={formData.amount}
                onChange={handleChange}
                className="xs:w-[70vw] md:w-[28vw] p-2 border rounded mb-4"
                />
            </div>
            <div className="flex items-center mb-4">
                <input
                    type="checkbox"
                    id="saveCard"
                    checked={saveCard}
                    onChange={() => setSaveCard(prev => !prev)}
                    className="mr-2"
                />
                <label htmlFor="saveCard" className="text-sm text-[#555]">
                    I agree to save my card details for future use
                </label>
            </div>
            </>
        )}
        <button
          type="submit"
          className="bg-[#2e294e] text-white sm:w-[50vw] md:w-[28vw] xs:w-[60vw] p-2 rounded hover:bg-[#675cae]"
        >
          Pay
        </button>
      </form>
    </div>
  )
}

export default BalanceTopUpForm
