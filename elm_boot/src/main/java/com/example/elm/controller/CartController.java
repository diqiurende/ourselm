package com.example.elm.controller;

import com.example.elm.domain.Cart;
import com.example.elm.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/CartController")
public class CartController {
    @Autowired
    private CartService cartService;

    @PostMapping("/listCart")
    public List<Cart> listCart(@RequestBody Cart cart){
        return cartService.listCart(cart);
    }

    @PostMapping("/saveCart")
    public int saveCart(@RequestBody Cart cart){
        return cartService.saveCart(cart);
    }

    @PostMapping("/updateCart")
    public int updateCart(@RequestBody Cart cart){
        return cartService.updateCart(cart);
    }

    @PostMapping("/removeCart")
    public int removeCart(@RequestBody Cart cart){
        return cartService.removeCart(cart);
    }
}
