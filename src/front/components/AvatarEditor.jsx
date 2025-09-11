import React, { useState, useEffect } from 'react';
import { createAvatar } from '@dicebear/core';
import { adventurer, personas, lorelei, miniavs } from '@dicebear/collection';

const AvatarEditor = () => {
    // 🎮 Avatar Settings - Like character customization in a video game!
    const [avatarSettings, setAvatarSettings] = useState({
        style: 'adventurer', // The art style (like choosing a game character type)
        seed: 'player1', // The base character (like your player name)
        hair: ['short01'], // Hair style
        hairColor: ['0066cc'], // Hair color
        eyes: ['variant01'], // Eye shape
        eyeColor: ['0066cc'], // Eye color
        mouth: ['variant01'], // Mouth expression
        skinColor: ['f2d3b1'], // Skin tone
        clothing: ['shirt01'], // What they're wearing
        clothingColor: ['262e33'], // Clothing color
        backgroundColor: ['b6e3f4'] // Background color
    });

    // 🖼️ The actual avatar picture (starts empty)
    const [avatarSvg, setAvatarSvg] = useState('');

    // 💾 Saved avatars (like a photo album)
    const [savedAvatars, setSavedAvatars] = useState([]);

    // 🎨 All the fun options kids can choose from!
    const styleOptions = [
        { name: 'adventurer', label: '🏰 Adventure Hero', colors: ['#ff6b6b', '#4ecdc4', '#45b7d1'] },
        { name: 'personas', label: '😊 Happy Face', colors: ['#96ceb4', '#ffeaa7', '#dda0dd'] },
        { name: 'lorelei', label: '👑 Royal Style', colors: ['#ff7675', '#74b9ff', '#a29bfe'] },
        { name: 'miniavs', label: '🎮 Game Character', colors: ['#00b894', '#fdcb6e', '#e17055'] }
    ];

    const hairOptions = ['short01', 'short02', 'short03', 'long01', 'long02', 'curly01'];
    const eyeOptions = ['variant01', 'variant02', 'variant03', 'variant04', 'variant05'];
    const mouthOptions = ['variant01', 'variant02', 'variant03', 'variant04'];
    const clothingOptions = ['shirt01', 'shirt02', 'hoodie', 'dress01', 'jacket'];

    // 🌈 Fun colors for kids to choose from
    const colorPalette = {
        hair: ['#8B4513', '#FFD700', '#000000', '#FF6347', '#9370DB', '#00CED1'],
        skin: ['#f2d3b1', '#ddb98a', '#c68642', '#8d5524', '#f9dcc4', '#e8c2a0'],
        clothing: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'],
        background: ['#b6e3f4', '#ffd93d', '#6c5ce7', '#a29bfe', '#fd79a8', '#00b894']
    };

    // 🎭 Fun expressions for the avatar
    const expressions = [
        { mouth: 'variant01', label: '😊 Happy' },
        { mouth: 'variant02', label: '😮 Surprised' },
        { mouth: 'variant03', label: '😄 Laughing' },
        { mouth: 'variant04', label: '😌 Cool' }
    ];

    // ✨ Magic function that creates the avatar picture!
    const generateAvatar = () => {
        try {
            // Pick the right art style
            const styleMap = {
                'adventurer': adventurer,
                'personas': personas,
                'lorelei': lorelei,
                'miniavs': miniavs
            };

            // Create the avatar with all the settings
            const avatar = createAvatar(styleMap[avatarSettings.style], {
                seed: avatarSettings.seed,
                hair: avatarSettings.hair,
                hairColor: avatarSettings.hairColor,
                eyes: avatarSettings.eyes,
                eyeColor: avatarSettings.eyeColor,
                mouth: avatarSettings.mouth,
                skinColor: avatarSettings.skinColor,
                clothing: avatarSettings.clothing,
                clothingColor: avatarSettings.clothingColor,
                backgroundColor: avatarSettings.backgroundColor
            });

            // Convert to picture format
            const svg = avatar.toString();
            setAvatarSvg(svg);
        } catch (error) {
            console.log('Oops! Avatar creation had a little hiccup:', error);
        }
    };

    // 🔄 Update avatar whenever settings change
    useEffect(() => {
        generateAvatar();
    }, [avatarSettings]);

    // 🎛️ Function to update any avatar setting
    const updateSetting = (key, value) => {
        setAvatarSettings(prev => ({
            ...prev,
            [key]: Array.isArray(value) ? value : [value]
        }));
    };

    // 💾 Save the current avatar design
    const saveAvatar = () => {
        const newAvatar = {
            id: Date.now(), // Unique ID
            name: `My Avatar ${savedAvatars.length + 1}`, // Auto name
            settings: { ...avatarSettings },
            svg: avatarSvg,
            timestamp: new Date().toLocaleString()
        };

        setSavedAvatars(prev => [...prev, newAvatar]);
        alert('🎉 Avatar saved! Great job creating your character!');
    };

    // 📱 Load a saved avatar
    const loadAvatar = (savedAvatar) => {
        setAvatarSettings(savedAvatar.settings);
        alert(`✨ Loaded "${savedAvatar.name}"! Your avatar is back!`);
    };

    // 🗑️ Delete a saved avatar
    const deleteAvatar = (id) => {
        setSavedAvatars(prev => prev.filter(avatar => avatar.id !== id));
        alert('🗑️ Avatar deleted!');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-400 to-blue-400 p-4">
            <div className="max-w-6xl mx-auto">
                {/* 🏆 Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                        🎨 PixelPlay Avatar Creator! 🎨
                    </h1>
                    <p className="text-white text-lg drop-shadow">
                        Design your fitness hero! Make them look awesome! 💪
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* 🖼️ Avatar Preview - The Big Picture! */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-yellow-300">
                            <h2 className="text-2xl font-bold text-center mb-4 text-purple-600">
                                👀 Your Avatar Preview
                            </h2>

                            <div className="flex justify-center mb-6">
                                <div className="w-64 h-64 bg-gray-100 rounded-2xl border-4 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                                    {avatarSvg ? (
                                        <div
                                            className="w-full h-full"
                                            dangerouslySetInnerHTML={{ __html: avatarSvg }}
                                        />
                                    ) : (
                                        <div className="text-gray-400 text-center">
                                            <div className="text-4xl mb-2">🎭</div>
                                            <p>Creating your avatar...</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* 💾 Save Button */}
                            <button
                                onClick={saveAvatar}
                                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-6 rounded-2xl text-xl shadow-lg transform hover:scale-105 transition-all duration-200"
                            >
                                💾 Save My Avatar!
                            </button>
                        </div>
                    </div>

                    {/* 🎛️ Controls Panel - All the Fun Buttons! */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-yellow-300">
                            <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">
                                🎮 Customize Your Hero!
                            </h2>

                            <div className="space-y-8">
                                {/* 🎨 Art Style Selector */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-gray-700">🏰 Choose Your Style</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {styleOptions.map(style => (
                                            <button
                                                key={style.name}
                                                onClick={() => updateSetting('style', style.name)}
                                                className={`p-4 rounded-2xl font-bold text-white shadow-lg transform hover:scale-105 transition-all duration-200 ${avatarSettings.style === style.name
                                                    ? 'ring-4 ring-yellow-400 scale-105'
                                                    : ''
                                                    }`}
                                                style={{
                                                    background: `linear-gradient(45deg, ${style.colors[0]}, ${style.colors[1]}, ${style.colors[2]})`
                                                }}
                                            >
                                                {style.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 💇 Hair Styles */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-gray-700">💇 Pick Your Hair!</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {hairOptions.map(hair => (
                                            <button
                                                key={hair}
                                                onClick={() => updateSetting('hair', hair)}
                                                className={`p-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 ${avatarSettings.hair[0] === hair ? 'ring-4 ring-yellow-400 scale-105' : ''
                                                    }`}
                                            >
                                                ✂️ {hair}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 🌈 Hair Colors */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-gray-700">🌈 Hair Color Magic!</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {colorPalette.hair.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => updateSetting('hairColor', color)}
                                                className={`w-12 h-12 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 border-4 ${avatarSettings.hairColor[0] === color ? 'border-yellow-400 scale-110' : 'border-white'
                                                    }`}
                                                style={{ backgroundColor: color }}
                                                title={`Hair color: ${color}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* 👀 Eyes */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-gray-700">👀 Eye Shapes!</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {eyeOptions.map(eye => (
                                            <button
                                                key={eye}
                                                onClick={() => updateSetting('eyes', eye)}
                                                className={`p-3 bg-purple-500 hover:bg-purple-600 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 ${avatarSettings.eyes[0] === eye ? 'ring-4 ring-yellow-400 scale-105' : ''
                                                    }`}
                                            >
                                                👁️ {eye}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 😊 Expressions */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-gray-700">😊 How Do You Feel?</h3>
                                    <div className="grid grid-cols-2 gap-3">
                                        {expressions.map(expr => (
                                            <button
                                                key={expr.mouth}
                                                onClick={() => updateSetting('mouth', expr.mouth)}
                                                className={`p-4 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 ${avatarSettings.mouth[0] === expr.mouth ? 'ring-4 ring-yellow-400 scale-105' : ''
                                                    }`}
                                            >
                                                {expr.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 👕 Clothing */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-gray-700">👕 What Will You Wear?</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {clothingOptions.map(clothing => (
                                            <button
                                                key={clothing}
                                                onClick={() => updateSetting('clothing', clothing)}
                                                className={`p-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg transform hover:scale-105 transition-all duration-200 ${avatarSettings.clothing[0] === clothing ? 'ring-4 ring-yellow-400 scale-105' : ''
                                                    }`}
                                            >
                                                👔 {clothing}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* 🎨 Background Colors */}
                                <div>
                                    <h3 className="text-xl font-bold mb-4 text-gray-700">🌈 Background Fun!</h3>
                                    <div className="flex flex-wrap gap-3">
                                        {colorPalette.background.map(color => (
                                            <button
                                                key={color}
                                                onClick={() => updateSetting('backgroundColor', color)}
                                                className={`w-12 h-12 rounded-full shadow-lg transform hover:scale-110 transition-all duration-200 border-4 ${avatarSettings.backgroundColor[0] === color ? 'border-yellow-400 scale-110' : 'border-white'
                                                    }`}
                                                style={{ backgroundColor: color }}
                                                title={`Background: ${color}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 💾 Saved Avatars Gallery */}
                {savedAvatars.length > 0 && (
                    <div className="mt-8">
                        <div className="bg-white rounded-3xl p-6 shadow-2xl border-4 border-yellow-300">
                            <h2 className="text-2xl font-bold text-center mb-6 text-purple-600">
                                🏆 Your Awesome Avatar Collection!
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {savedAvatars.map(avatar => (
                                    <div key={avatar.id} className="bg-gray-50 rounded-2xl p-4 text-center border-2 border-gray-200">
                                        <div
                                            className="w-20 h-20 mx-auto mb-3 rounded-xl overflow-hidden border-2 border-gray-300"
                                            dangerouslySetInnerHTML={{ __html: avatar.svg }}
                                        />
                                        <p className="font-bold text-sm text-gray-700 mb-2">{avatar.name}</p>
                                        <p className="text-xs text-gray-500 mb-3">{avatar.timestamp}</p>

                                        <div className="space-y-2">
                                            <button
                                                onClick={() => loadAvatar(avatar)}
                                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-3 rounded-xl text-sm shadow transform hover:scale-105 transition-all duration-200"
                                            >
                                                ✨ Load
                                            </button>
                                            <button
                                                onClick={() => deleteAvatar(avatar.id)}
                                                className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-3 rounded-xl text-sm shadow transform hover:scale-105 transition-all duration-200"
                                            >
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AvatarEditor;