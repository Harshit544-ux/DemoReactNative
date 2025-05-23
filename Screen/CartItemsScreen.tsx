import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, StyleSheet, Text, Image, TouchableOpacity, Modal } from "react-native";
import { FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ArrowLeftIcon from "react-native-vector-icons/AntDesign";
import CancelIcon from "react-native-vector-icons/Entypo"
import { useDispatch, useSelector } from "react-redux";
import { increaseQuantity, decreaseQuantity, removeFromCart } from "../src/slices/cartSlice";
import PlusIcon from 'react-native-vector-icons/AntDesign';
import MinusIcon from 'react-native-vector-icons/AntDesign';
import CustomButton from "../Component/CustomButton";


interface CartItem {
    id: number;
    title: string;
    brand: string;
    image: string;
    originalPrice: string;
    discount: string;
    price: string;
    size: string;
    quantity: number;
}

const CartItemScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const cartItems = useSelector((state: any) => state.cart.items);
    const [showRemoveModal, setShowRemoveModal] = useState(false);
    const [itemToRemove, setItemToRemove] = useState<CartItem | null>(null);


    // Handler for minus button

    const handleDecrease = (item: CartItem) => {
        if (item.quantity === 1) {
            setItemToRemove(item);
            setShowRemoveModal(true);
        } else {
            dispatch(decreaseQuantity(item.id));
        }
    };

    // Handler for confirming removal
    const confirmRemove = () => {
        if (itemToRemove) {
            dispatch(removeFromCart(itemToRemove.id));
        }
        setShowRemoveModal(false);
        setItemToRemove(null);
    };

    // Handler for canceling removal
    const cancelRemove = () => {
        setShowRemoveModal(false);
        setItemToRemove(null);
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <View style={styles.cartHeaderContainer} >
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeftIcon name="arrowleft" size={25} color="#000" />
                </TouchableOpacity>
                <Text style={styles.cartHeaderText}>Cart</Text>
            </View>
            <Text style={styles.cartItemCountText}>
                {cartItems.length} item{cartItems.length !== 1 ? "s" : ""} in your cart
            </Text>
            <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 20 }}
                renderItem={({ item }) => (
                    <View style={styles.cartCardContainer}>
                        <View style={styles.cartItemCard}>
                            <View style={styles.cartItemCardDescription}>
                                <View style={styles.cartItemRow}>
                                    <Image
                                        source={{ uri: item.image }}
                                        style={styles.cartItemImage}
                                        resizeMode="cover"
                                    />
                                    <View style={styles.cartItemTextContainer}>
                                        <Text style={styles.cartItemTitle}>
                                            {item.title}
                                        </Text>
                                        <Text style={styles.cartItemSubtitle}>{item.brand}</Text>
                                    </View>
                                    <TouchableOpacity  
                                        onPress={() => {
                                            setItemToRemove(item);
                                            setShowRemoveModal(true);
                                        }}
                                        style={{ position: "absolute", right: 10, top: 10,height:30,width:30,backgroundColor:"#fff",elevation:4,alignItems:"center",justifyContent:"center",borderRadius:50 }}
                                    >
                                        <CancelIcon name="cross" size={20} color="black" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            <View style={styles.cartItemCardPrice}>
                                {/* Left: Price Info */}
                                <View style={{ flex: 1 }}>
                                    {/* MRP and Discount in one row */}
                                    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 2 }}>
                                        <Text style={{ color: "#666", fontSize: 13 }}>
                                            MRP <Text style={{ textDecorationLine: "line-through" }}>{item.originalPrice}</Text>
                                        </Text>
                                        <Text style={{ color: "#2BB789", fontWeight: "bold", fontSize: 13, marginLeft: 8 }}>{item.discount}</Text>
                                    </View>
                                    {/* Price */}
                                    <Text style={{ color: "#222", fontSize: 16 }}>
                                        ₹{Number(item.price.replace(/[^\d]/g, "")) * (item.quantity || 1)}
                                    </Text>
                                    {/* Tube info */}
                                    <Text style={{
                                        backgroundColor: "#D3D3D3",
                                        color: "#36454F",
                                        fontSize: 10,
                                        fontWeight: "500",
                                        paddingVertical: 6,
                                        paddingHorizontal: 12,
                                        marginTop: 5,
                                        borderRadius: 7,
                                        marginLeft: -3,
                                        alignSelf: "flex-start",
                                        textAlign: "center",
                                    }}>{item.size}</Text>
                                </View>
                                {/* Right: Add Quantity Button */}
                                <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8, backgroundColor: "#1F41BB", borderRadius: 5, paddingVertical: 5, paddingHorizontal: 10 }}>
                                    <TouchableOpacity onPress={() => handleDecrease(item)}>
                                        <MinusIcon name="minus" size={20} color="white" />
                                    </TouchableOpacity>
                                    <Text style={{ fontSize: 16, color: "white", fontWeight: "bold" }}>
                                        {item.quantity || 1}
                                    </Text>
                                    <TouchableOpacity onPress={() => dispatch(increaseQuantity(item.id))}>
                                        <PlusIcon name="plus" size={20} color="white" />
                                    </TouchableOpacity>
                                </View>

                               
                            </View>

                        </View>
                    </View>
                )}
            />


             {/* Modal for confirmation */}
                                <Modal
                                    visible={showRemoveModal}
                                    transparent
                                    animationType="fade"
                                    onRequestClose={cancelRemove}
                                >
                                    <View style={{
                                        flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)'
                                    }}>
                                        <View style={{
                                            backgroundColor: 'white', padding: 20, alignItems: 'center', width: '100%', borderTopLeftRadius: 20, borderTopRightRadius: 20
                                        }}>
                                            <View style={{ flexDirection: "row", alignItems: "center",gap:58, marginBottom: 5 }}>
                                                <Text style={{ fontSize: 18,fontFamily:"sans-serif" }}>Remove the item from your cart ?</Text>

                                                <TouchableOpacity onPress={cancelRemove} style={{height:30,width:30,backgroundColor:"#fff",elevation:4,alignItems:"center",justifyContent:"center",borderRadius:50 }}>
                                                    <CancelIcon name="cross" size={20} color="black" />
                                                </TouchableOpacity>
                                            </View>
                                            <CustomButton 
                                                text="Yes, remove" 
                                                isActive={true} 
                                                onPress={confirmRemove}
                                                style={[styles.addToCartButton, { borderColor: "#3187A2", borderWidth: 1, paddingHorizontal: 120, marginTop: 16 }]} 
                                                textStyle={{ color: "#3187A2", fontWeight: "bold", fontSize: 16, fontFamily: "Poppins" }} 
                                            />
                                           
                                                <CustomButton text="Cancel" 
                                                isActive={true} 
                                                onPress={cancelRemove}
                                                style={[styles.cancelToCartButton, { marginTop: 8,borderColor: "#fd1207", borderWidth: 1, paddingHorizontal: 140 }]} 
                                                textStyle={{ color: "#fd1207", fontWeight: "bold", fontSize: 16, fontFamily: "Poppins" }} />
                                          
                                        </View>
                                    </View>
                                </Modal>
        </SafeAreaView>
    )
}

export default CartItemScreen;

const styles = StyleSheet.create({
    cartHeaderContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 10,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        height: 60,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
    },
    cartHeaderText: {
        fontSize: 18,
        fontFamily: "Poppins",
        color: "#222",
    },
    cartCardContainer: {
        height: 200,
        width: "100%",
        gap: 18,
        marginTop: 10,
        marginBottom: 20,
        // backgroundColor: "blue",
    },
    cartItemCountText: {
        fontSize: 18,
        fontFamily: "sans-serif",
        color: "#000",
        marginTop: 20,
        marginLeft: 22,
        marginBottom: 5,
    },
    cartItemCard: {
        width: "90%",
        height: 200,
        alignSelf: "center",
        backgroundColor: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        elevation: 5,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
    cartItemCardDescription: {
        width: "100%",
        height: 90,
        backgroundColor: "#f2f4f4",
    },
    cartItemCardPrice: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 5,
        width: "100%",
        height: 90,
        paddingTop: 6,
        paddingHorizontal: 12,
        backgroundColor: "#fff",
    },
    imageContainer: {
        width: "100%",
        height: 70,
        borderRadius: 10,
        overflow: "hidden",
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "20%",     // smaller image
        height: "50%",
        borderRadius: 10,
    },
    cartItemRow: {
        flexDirection: "row",
        alignItems: "center",
        // backgroundColor: "#fff",
        // borderRadius: 12,
        padding: 10,
        // marginVertical: 0,
        // marginHorizontal: 10,
        // elevation: 2,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 2 },
        // shadowOpacity: 0.1,
        // shadowRadius: 4,
        borderWidth: 0,
    },
    cartItemImage: {
        width: 70,
        height: 70,
        borderRadius: 10,
    },
    cartItemTextContainer: {
        flex: 1,
        marginLeft: 12,
    },
    cartItemTitle: {
        fontWeight: "bold",
        color: "#222",
        fontSize: 14,
    },
    cartItemSubtitle: {
        color: "#666",
        marginTop: 4,
        fontSize: 12,
    },
    addButtonContainer: {
        backgroundColor: "#E6F7FB",
        borderRadius: 8,
        paddingVertical: 6,
        paddingHorizontal: 24,
        borderWidth: 1,
        borderColor: "#7CC1D7",
    },
    addButtonText: {
        color: "#3187A2",
        fontWeight: "bold",
        fontSize: 15,
        textAlign: "center",
    },
    addToCartButton: {
        backgroundColor: '#DEEFF5',
        borderColor: '#7CC1D7',

    },
    cancelToCartButton: {
        backgroundColor: '#fff',
        borderColor: '#7CC1D7',

    },
})


