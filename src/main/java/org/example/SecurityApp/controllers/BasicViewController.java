package org.example.SecurityApp.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class BasicViewController {

    @GetMapping("/login")
    public String loginPage() {
        return "/login";
    }

    @GetMapping("/index")
    public String allUsers() {
        return "/allUsers";
    }

    @GetMapping("/user")
    public String userPage() {
        return "/userPage";
    }

    @GetMapping("/")
    public String redirect() {
        return "redirect:/user";
    }
}
