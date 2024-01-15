package com.example.elm.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.example.elm.domain.Orders;

import java.util.List;

public interface OrdersService extends IService<Orders> {

    public int generateOrders(Orders orders);

    public Orders getOrderById(Integer orderId);
    public List<Orders> listOrdersByuser(String userId);
}
