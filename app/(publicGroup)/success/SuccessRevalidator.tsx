"use client"

import { useEffect } from "react";
import { confirmPaymentSuccess } from "../_actions/confirmPaymentSuccess";


export function SuccessRevalidator() {
    useEffect(() => {
        confirmPaymentSuccess();
    }, []);

    return null;
}