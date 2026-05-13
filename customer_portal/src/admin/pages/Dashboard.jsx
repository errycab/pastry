import React from 'react';
import { motion } from 'framer-motion';

import Navbar from '../components/Navbar';

import {
  DollarSign,
  ClipboardList,
  Users,
  TrendingUp,
  Package
} from 'lucide-react';

function StatCard({ title, value, icon: Icon, color }) {

  return (

    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-[30px] p-6 shadow-lg border border-[#f3f3f3]"
    >

      <div className="flex items-center justify-between">

        <div>

          <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400 font-black mb-3">

            {title}

          </p>

          <h2 className="text-4xl font-serif font-bold">

            {value}

          </h2>

        </div>

        <div className={`${color} w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg`}>

          <Icon size={30} />

        </div>

      </div>

    </motion.div>

  );

}

export default function Dashboard() {

  return (

    <div className="bg-[#faf7f2] min-h-screen font-['DM_Sans']">

      {/* NAVBAR */}

      <Navbar />

      {/* HERO */}

      <div className="relative overflow-hidden bg-black h-[320px] flex items-center">

        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=2000')",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-10 w-full">

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-[#d4af37] text-[10px] uppercase tracking-[0.4em] font-black mb-4"
          >

            Pastry Admin Panel

          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white text-6xl font-serif font-bold leading-tight"
          >

            Manage Your
            <br />

            <span className="italic text-[#d4af37]">

              Pastry Business.

            </span>

          </motion.h1>

        </div>

      </div>

      <div className="max-w-7xl mx-auto px-10 py-12">

        {/* STATS */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 mb-14">

          <StatCard
            title="Total Orders"
            value="152"
            icon={ClipboardList}
            color="bg-[#c08457]"
          />

          <StatCard
            title="Revenue"
            value="₱24K"
            icon={DollarSign}
            color="bg-[#4f772d]"
          />

          <StatCard
            title="Products"
            value="48"
            icon={Package}
            color="bg-[#b56576]"
          />

          <StatCard
            title="Customers"
            value="87"
            icon={Users}
            color="bg-[#457b9d]"
          />

        </div>

        {/* MAIN GRID */}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

          {/* RECENT ORDERS */}

          <div className="xl:col-span-2 bg-white rounded-[35px] p-8 shadow-lg">

            <div className="flex items-center justify-between mb-8">

              <div>

                <p className="text-[#d4af37] text-[10px] uppercase tracking-[0.4em] font-black mb-2">

                  Orders

                </p>

                <h2 className="text-3xl font-serif font-bold">

                  Recent Orders

                </h2>

              </div>

              <button className="bg-black text-white px-6 py-3 rounded-full text-[11px] uppercase tracking-[0.2em] font-black hover:bg-[#d4af37] hover:text-black transition-all">

                View All

              </button>

            </div>

            <div className="overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead>

                  <tr className="border-b">

                    <th className="text-left pb-5 text-gray-400 text-[11px] uppercase tracking-[0.2em]">

                      Order

                    </th>

                    <th className="text-left pb-5 text-gray-400 text-[11px] uppercase tracking-[0.2em]">

                      Customer

                    </th>

                    <th className="text-left pb-5 text-gray-400 text-[11px] uppercase tracking-[0.2em]">

                      Product

                    </th>

                    <th className="text-left pb-5 text-gray-400 text-[11px] uppercase tracking-[0.2em]">

                      Total

                    </th>

                    <th className="text-left pb-5 text-gray-400 text-[11px] uppercase tracking-[0.2em]">

                      Status

                    </th>

                  </tr>

                </thead>

                <tbody>

                  <tr className="border-b hover:bg-[#faf7f2] transition-all">

                    <td className="py-5 font-bold">

                      #1021

                    </td>

                    <td>Maria</td>

                    <td>Chocolate Cake</td>

                    <td>₱850</td>

                    <td>

                      <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-xs font-bold">

                        Preparing

                      </span>

                    </td>

                  </tr>

                  <tr className="border-b hover:bg-[#faf7f2] transition-all">

                    <td className="py-5 font-bold">

                      #1022

                    </td>

                    <td>John</td>

                    <td>Custom Cake</td>

                    <td>₱1500</td>

                    <td>

                      <span className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-xs font-bold">

                        Completed

                      </span>

                    </td>

                  </tr>

                </tbody>

              </table>

            </div>

          </div>

          {/* SIDE PANEL */}

          <div className="space-y-8">

            {/* TOP PRODUCTS */}

            <div className="bg-white rounded-[35px] p-8 shadow-lg">

              <div className="flex items-center gap-3 mb-8">

                <TrendingUp className="text-[#d4af37]" />

                <h2 className="text-2xl font-serif font-bold">

                  Top Products

                </h2>

              </div>

              <div className="space-y-5">

                <div className="bg-[#faf7f2] rounded-3xl p-5 flex items-center justify-between">

                  <div>

                    <h3 className="font-bold">

                      Chocolate Cake

                    </h3>

                    <p className="text-sm text-gray-500">

                      35 orders

                    </p>

                  </div>

                  <span className="font-black text-[#c08457]">

                    ₱12K

                  </span>

                </div>

                <div className="bg-[#faf7f2] rounded-3xl p-5 flex items-center justify-between">

                  <div>

                    <h3 className="font-bold">

                      Strawberry Cake

                    </h3>

                    <p className="text-sm text-gray-500">

                      28 orders

                    </p>

                  </div>

                  <span className="font-black text-[#c08457]">

                    ₱9K

                  </span>

                </div>

              </div>

            </div>

            {/* QUICK ACTIONS */}

            <div className="bg-black rounded-[35px] p-8 text-white shadow-2xl">

              <p className="text-[#d4af37] text-[10px] uppercase tracking-[0.4em] font-black mb-3">

                Quick Actions

              </p>

              <h2 className="text-3xl font-serif font-bold mb-8">

                Manage Faster

              </h2>

              <div className="space-y-4">

                <button className="w-full bg-white text-black py-4 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-[#d4af37] transition-all">

                  Add Product

                </button>

                <button className="w-full border border-white py-4 rounded-full font-black text-[11px] uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">

                  View Orders

                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );

}