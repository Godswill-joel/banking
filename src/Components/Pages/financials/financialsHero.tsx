export default function FinancialsHero() {
    return (

        <section className="relative w-full min-h-screen text-white overflow-hidden">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('/assets/public-financials.webp')" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-black/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-black/10" />

            <div className="relative max-w-7xl mx-auto px-6 py-32 min-h-screen flex items-center">
                <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

    
                    <div className="max-w-lg">
                        <h1 className="text-3xl sm:text-4xl lg:text-4xl font-semibold leading-tight mb-6">
                            The gold standard:{" "}
                            <span className="text-[#D3AC6A]">
                                Public Financials and Proof of Reserves
                            </span>
                        </h1>

                        <p className="text-gray-300 text-lg leading-relaxed">
                            You deserve to know that your financial institutions are safe and
                            sound. You can review River’s financial health and full reserve
                            custody for yourself.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}