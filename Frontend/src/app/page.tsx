import React from 'react'; 
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Header from "../components/Header";
import AirdropPage from '@/components/AirdropPage';
// import FundIdrisForm from "@/components/FundIdrisForm";
// import FundIdrisDashboard from "../components/FundIdrisDashboard";

export default function Home() {
  return(
    <div>
      <AirdropPage
      />
      {/* <FundIdrisDashboard /> */}
      {/* <FundIdrisForm /> */}
    </div>
  );
}