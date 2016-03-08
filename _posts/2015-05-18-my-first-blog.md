---
layout: post
keywords: Start
description: 我的第一篇博客
title: 我的第一篇博客
categories: [日常]
tags: [日常]
group: archive
icon: globe
---

Hello World！This is my first Blog. I like write code :

    public class Me {

        public static final String name = "saymagic";
        
        public static short age = 22;
        
        public static String work = "Android Programmer";
                
        public static void main(String[] args) {
            selfIntroduction();
        }
        
        public static void selfIntroduction(){
            System.out.println("Hello everyone,"
                    * "my name is " + name
                    * ", I am " + age + " years old. "
                    * "I am an " + work + "!");
        }
    }