import  { useState, useRef, useEffect } from "react";

const SpinnerApp = () => {
  const [names, setNames] = useState([]);
  const [inputName, setInputName] = useState("");
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null);
  const [winnersHistory, setWinnersHistory] = useState([]);
  const wheelRef = useRef(null);

  useEffect(() => {
    const storedWinners = JSON.parse(localStorage.getItem("winners")) || [];
    setWinnersHistory(storedWinners);
  }, []);

  useEffect(() => {
    localStorage.setItem("winners", JSON.stringify(winnersHistory));
  }, [winnersHistory]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputName(value);
    const newNames = value
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name !== "");
    setNames(newNames);
  };

  const spin = () => {
    if (names.length < 2 || spinning) return;
    const angle = 3600 + Math.floor(Math.random() * 360);
    const duration = 5000;
    const selectedIndex = Math.floor((angle % 360) / (360 / names.length));
    const adjustedIndex = (names.length - selectedIndex - 1 + names.length) % names.length;

    setSpinning(true);
    wheelRef.current.style.transition = `transform ${duration}ms ease-out`;
    wheelRef.current.style.transform = `rotate(${angle}deg)`;

    setTimeout(() => {
      const selected = names[adjustedIndex];
      setWinner(selected);
      setWinnersHistory((prev) => [...prev, selected]);
      setSpinning(false);
    }, duration);
  };

  const colors = ["#f44336", "#2196f3", "#4caf50", "#ffc107"];

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <h1 className="text-2xl font-bold">Spinner App</h1>

      <div className="w-full max-w-xl">
        <textarea
          value={inputName}
          onChange={handleInputChange}
          placeholder="Enter one name per line"
          className="border px-2 py-1 rounded w-full h-40 resize-none"
        ></textarea>
      </div>

      <div className="relative w-[600px] h-[600px] rounded-full overflow-hidden border-4 border-gray-500">
        <div
          ref={wheelRef}
          className="absolute w-full h-full rounded-full"
          style={{ transition: "transform 0s", transform: "rotate(0deg)" }}
        >
          <svg width="600" height="600" viewBox="0 0 300 300" className="block">
            <g transform="translate(150,150)">
              {names.map((name, i) => {
                const sliceDeg = 360 / names.length;
                const startAngle = sliceDeg * i;
                const endAngle = sliceDeg * (i + 1);
                const largeArc = sliceDeg > 180 ? 1 : 0;
                const radius = 150;
                const x1 = radius * Math.cos((Math.PI * startAngle) / 180);
                const y1 = radius * Math.sin((Math.PI * startAngle) / 180);
                const x2 = radius * Math.cos((Math.PI * endAngle) / 180);
                const y2 = radius * Math.sin((Math.PI * endAngle) / 180);
                const background = colors[i % colors.length];
                const textRadius = radius * 0.65;
                const displayName = name.length > 15 ? name.slice(0, 12) + "..." : name;

                return (
                  <g key={i}>
                    <path
                      d={`M0,0 L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`}
                      fill={background}
                    />
                    <text
                      x={textRadius * Math.cos((Math.PI * (startAngle + sliceDeg / 2)) / 180)}
                      y={textRadius * Math.sin((Math.PI * (startAngle + sliceDeg / 2)) / 180)}
                      fill="white"
                      fontSize="13"
                      fontWeight="bold"
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {displayName}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-black rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute top-0 left-1/2 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-black transform -translate-x-1/2"></div>
      </div>

      <button
        onClick={spin}
        disabled={spinning || names.length < 2}
        className="bg-green-500 text-white px-6 py-2 rounded"
      >
        Spin
      </button>

      {winner && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-xl">
            <h2 className="text-xl font-bold mb-2">🎉 Winner: {winner} 🎉</h2>
            <button onClick={() => setWinner(null)} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-lg font-semibold">Winners History:</h3>
        <ul className="list-disc pl-6">
          {winnersHistory.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SpinnerApp;