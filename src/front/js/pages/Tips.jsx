import React, { useState } from 'react';
import "../../styles/tips.css";

const Tips = () => {
    const [showWhat, setShowWhat] = useState(false);
    const [showRemember, setShowRemember] = useState(false);
    const [selectedTip, setSelectedTip] = useState(null);

    const handleWhatClick = () => {
        setShowWhat(!showWhat);
        setShowRemember(false);
        setSelectedTip(null);
    };

    const handleRememberClick = () => {
        setShowRemember(!showRemember);
        setShowWhat(false);
        setSelectedTip(null);
    };

    const handleTipClick = (tip) => {
        setSelectedTip(selectedTip === tip ? null : tip);
    };

    const getButtonClass = (isSelected) => {
        return isSelected ? 'btn btn-outline-light btn-lg active' : 'btn btn-outline-light btn-lg';
    };

    return (
        <div className="container mt-5">
            <h2 className="text-white text-center mb-4">FAQs</h2>
            <div className="d-flex justify-content-around mb-4">
                <button className="btn btn-outline-light btn-lg" onClick={handleWhatClick}>
                    What do you want?
                </button>
                <button className="btn btn-outline-light btn-lg" onClick={handleRememberClick}>
                    Remember!
                </button>
            </div>
            {showWhat && (
                <div className="d-flex">
                    <div className="btn-group-vertical me-3">
                        <div className="tip-button-group">
                            <button className={getButtonClass(selectedTip === 'Muscle mass')} onClick={() => handleTipClick('Muscle mass')}>
                                Muscle mass
                            </button>
                            {selectedTip === 'Muscle mass' && (
                                <div className="tip-text-horizontal">Perform sets of 8 to 12 repetitions with slow and controlled movements, taking twice as long on the negatives.</div>
                            )}
                        </div>
                        <div className="tip-button-group">
                            <button className={getButtonClass(selectedTip === 'Definition')} onClick={() => handleTipClick('Definition')}>
                                Definition
                            </button>
                            {selectedTip === 'Definition' && (
                                <div className="tip-text-horizontal">Perform sets of 15 to 20 repetitions with fast movements; you should feel the muscle burn.</div>
                            )}
                        </div>
                        <div className="tip-button-group">
                            <button className={getButtonClass(selectedTip === 'Strength')} onClick={() => handleTipClick('Strength')}>
                                Strength
                            </button>
                            {selectedTip === 'Strength' && (
                                <div className="tip-text-horizontal">Perform sets of 2 to 5 repetitions of compound exercises and for large muscle groups; remember to warm up well beforehand.</div>
                            )}
                        </div>
                        <div className="tip-button-group">
                            <button className={getButtonClass(selectedTip === 'Maintain fitness')} onClick={() => handleTipClick('Maintain fitness')}>
                                Maintain fitness
                            </button>
                            {selectedTip === 'Maintain fitness' && (
                                <div className="tip-text-horizontal">Perform full-body circuits, adding 1-2 exercises for each muscle group each day and doing them one after the other; rest at the end of the circuit and do 2 to 4 circuits per day.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {showRemember && (
                <ul className="list-group">
                    <li className="list-group-item text-white bg-dark">* Warm-up and stretching are essential for proper physical activity, especially in strength exercises.</li>
                    <li className="list-group-item text-white bg-dark">* Rest is as important as exercise; if you train intensely and do not rest adequately, it can be counterproductive, preventing necessary recovery and increasing the risk of injury.</li>
                    <li className="list-group-item text-white bg-dark">* Nutrition is the foundation of progress; proper nutrition optimizes your training and results.</li>
                    <li className="list-group-item text-white bg-dark">* In weight training, negatives refer to the eccentric phase of an exercise, where the muscle lengthens as the weight is lowered in a controlled manner, which increases tension and improves muscle strength.</li>
                </ul>
            )}
        </div>
    );
};

export default Tips;
