function App() {

  return (
    <div className="container flex">

      <div className="flex-none w-48 h-screen bg-violet-900">
        <header>
          <h1 className="p-5 text-xl font-bold border-b border-violet-600">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-6 h-6 stroke-2 stroke-blue-400 inline mb-1">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 7.5l-2.25-1.313M21 7.5v2.25m0-2.25l-2.25 1.313M3 7.5l2.25-1.313M3 7.5l2.25 1.313M3 7.5v2.25m9 3l2.25-1.313M12 12.75l-2.25-1.313M12 12.75V15m0 6.75l2.25-1.313M12 21.75V19.5m0 2.25l-2.25-1.313m0-16.875L12 2.25l2.25 1.313M21 14.25v2.25l-2.25 1.313m-13.5 0L3 16.5v-2.25" />
            </svg>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-white pl-1">Emulator</span>
          </h1>
        </header>

        <nav>
          <h2 className="py-4 pl-4 font-bold text-violet-400">
            Products
          </h2>

          <ul className="pl-5 text-blue-300">
            <li className="py-1 cursor-pointer">
              <a href="/pubsub" className="hover:text-violet-100">
                <img src="/icons/pubsub.svg" className="w-4 h-4 inline mb-1" alt="Pubsub" />
                <span className="pl-2">PubSub</span>
              </a>
            </li>
            <li className="py-1 cursor-pointer">
              <a href="/firestore" className="hover:text-violet-100">
                <img src="/icons/firestore.svg" className="w-4 h-4 inline mb-1" alt="Firestore" />
                <span className="pl-2">Firestore</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-auto p-5 text-blue-900">
        <p>A little application to help GCP emulator interactions.</p>
        <p>On the left, click on the product you want to use.</p>
      </div>

    </div>
  );
}

export default App;
