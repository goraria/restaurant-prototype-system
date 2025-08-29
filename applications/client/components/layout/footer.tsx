import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { FooterLink } from "@/components/elements/footer-link";
import { appGlobal, footer } from "@/constants/constants";

export function Footer() {

  return (
    <footer className="bottom-0 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {/* Logo và thông tin công ty - 2 cột */}
          <div className="md:col-span-2 lg:col-span-2 row-span-2 space-y-4">
            <Link href="/customer" className="flex items-center space-x-2 mb-6">
              <div className="w-16 h-16 rounded-lg flex items-center justify-center">
                <Image
                  src="/logos/icon.png"
                  alt="Logo"
                  width={64}
                  height={64}
                />
              </div>
              <span className="font-bold text-2xl">{appGlobal.name}</span>
            </Link>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              {footer.introduction}
            </p>
            {/* <div className="space-y-4"> */}
            {/* <h3 className="text-2xl font-bold text-foreground">{appGlobal.name}</h3> */}
            {/* <p className="text-sm text-foreground">{appGlobal.description}</p> */}
            {/* </div> */}

            {footer.information.map((infoSection, index) => (
              <div key={index} className="space-y-2">
                <h5 className="text-lg font-semibold text-foreground">{infoSection.title}</h5>
                {infoSection.description.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 text-${item.color}`} />
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            ))}

            <div className="space-y-2">
              <h5 className="text-lg font-semibold text-foreground">Phản hồi</h5>
              <p className="text-sm text-muted-foreground">{footer.feedback}</p>
            </div>

            <div className="space-y-2">
              <h5 className="text-lg font-semibold text-foreground">{footer.socials.title}</h5>
              <div className="flex items-center space-x-2">
                {footer.socials.item.map((social, index) => (
                  <Link
                    key={index}
                    href={social.link}
                    className={`w-9 h-9 bg-popover rounded-lg flex items-center justify-center hover:bg-[${social.hover}] transition-colors`}
                    aria-label={social.name}
                  >
                    <social.icon className="h-5 w-5" />
                  </Link>
                ))}
                {/* <Link
                  href=""
                  className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center hover:bg-[#0068ff] transition-colors"
                  aria-label=""
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href=""
                  className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center hover:bg-[#e73495] transition-colors"
                  aria-label=""
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href=""
                  className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center hover:bg-[#249ef0] transition-colors"
                  aria-label=""
                >
                  <Twitter className="h-5 w-5" />
                </Link>
                <Link
                  href=""
                  className="w-9 h-9 bg-secondary rounded-lg flex items-center justify-center hover:bg-[#fe080a] transition-colors"
                  aria-label=""
                >
                  <Youtube className="h-5 w-5" />
                </Link> */}
              </div>
            </div>

            {/* <div className="space-y-2">
              <h5 className="text-lg font-semibold text-foreground">Thành tựu</h5>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-professional-orange" />
                <span className="text-sm text-muted-foreground">Top 10 nhà hàng Việt Nam 2024</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-professional-orange" />
                <span className="text-sm text-muted-foreground">4.8/5 sao đánh giá khách hàng</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-professional-orange" />
                <span className="text-sm text-muted-foreground">10,000+ khách hàng hài lòng</span>
              </div>
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-professional-orange" />
                <span className="text-sm text-muted-foreground">Hơn 1,000 bức ảnh món ăn được chia sẻ</span>
              </div>
            </div> */}
            {/* <div className="space-y-2">
              <h5 className="text-lg font-semibold text-foreground">Thông tin liên hệ</h5>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-main" />
                <span className="text-sm text-muted-foreground">Địa chỉ: {appGlobal.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-main" />
                <span className="text-sm text-muted-foreground">Hotline: {appGlobal.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-main" />
                <span className="text-sm text-muted-foreground">Email: {appGlobal.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-main" />
                <span className="text-sm text-muted-foreground">Giờ mở cửa: {appGlobal.opening}</span>
              </div>
            </div> */}
            {/* <div className="text-sm text-foreground space-y-1">
              <span className="flex items-center mt-4">
                <MapPin size={20} className="h-5 w-5 me-2" />
                <p>{appGlobal.address}</p>
              </span>
              <span className="flex items-center mt-4">
                <Phone size={20} className="h-5 w-5 me-2" />
                <p>Hotline: {appGlobal.phone}</p>
              </span>
              <span className="flex items-center mt-4">
                <Mail size={20} className="h-5 w-5 me-2" />
                <p>Email: {appGlobal.email}</p>
              </span>
              <span className="flex items-center mt-4">
                <Clock size={20} className="h-5 w-5 me-2" />
                <p>Giờ mở cửa: {appGlobal.opening}</p>
              </span>
            </div> */}
            {/* <div className="space-y-2">
              <h5 className="text-lg font-semibold text-foreground">Kết nối với chúng tôi</h5>
              <div className="flex items-center gap-3">
                <Award className="h-5 w-5 text-professional-orange" />
                <span className="text-sm text-muted-foreground">Đặt bàn trước 24h để có ưu đãi</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-professional-orange" />
                <span className="text-sm text-muted-foreground">Chat trực tiếp với chúng tôi hoặc chat qua Zalo</span>
              </div>
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-professional-orange" />
                <span className="text-sm text-muted-foreground">10,000+ khách hàng hài lòng</span>
              </div>
            </div> */}
          </div>

          {/* Các cột thông tin - 4 cột bên phải */}

          {/* <div className="space-y-2">
            <h5 className="text-lg font-semibold text-foreground">Phương thức thanh toán</h5>
            <ul className="space-y-2">
              {footerLinks.paymentIcons.map((paymentIcon, index) => (
                <li key={index}>
                  <FooterLink
                    item={paymentIcon}
                  />
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="text-lg font-semibold text-foreground">Chính sách</h5>
            <ul className="space-y-2">
              {footerLinks.usefulInfo.map((useful, index) => (
                <li key={index}>
                  <FooterLink item={useful} />
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-2">
            <h5 className="text-lg font-semibold text-foreground">Social</h5>
            <ul className="space-y-2">
              {footerLinks.socialIcons.map((socialIcon, index) => (
                <li key={index}>
                  <FooterLink item={socialIcon} />
                </li>
              ))}
            </ul>
          </div> */}

          {/* {footer.information.map((infoSection, index) => (
              <div key={index} className="space-y-2">
                <h5 className="text-lg font-semibold text-foreground">{infoSection.title}</h5>
                {infoSection.description.map((item, itemIndex) => (
                  <div key={itemIndex} className="flex items-center gap-3">
                    <item.icon className={`h-5 w-5 text-${item.color}`} />
                    <span className="text-sm text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            ))} */}

          {footer.sections.map((section, index) => (
            <div key={index} className="space-y-2">
              <h5 className="text-lg font-semibold text-foreground">{section.title}</h5>
              {section.items.map((item, itemIndex) => (
                <Link
                  key={itemIndex}
                  href={item.href}
                  className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                >
                  <item.icon className={`h-5 w-5 text-[${item.color}]`} />
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-muted-foreground text-sm">
            {appGlobal.copyright}
          </div>

          <div className="flex flex-wrap gap-6 text-sm">
            <Link href="#" className="text-muted-foreground hover:text-professional-main transition-colors">
              Chính sách bảo mật
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-professional-main transition-colors">
              Điều khoản sử dụng
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-professional-main transition-colors">
              Chính sách cookie
            </Link>
            <Link href="#" className="text-muted-foreground hover:text-professional-main transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8">
          <div className="text-center space-y-2">
            <h5 className="text-base font-medium text-foreground">
              {appGlobal.copyleft}
            </h5>
            {/* <h5 className="text-base font-medium text-foreground"> */}
            {/* {appGlobal.copyright} */}
            {/* Copyright &copy; 2020 - {(new Date().getFullYear())} Gorth Inc. All rights reserved. */}
            {/* Bản quyền &copy; Gorth Inc. 2020 - {(new Date().getFullYear())} Bảo lưu mọi quyền. */}
            {/* </h5> */}
          </div>
        </div>
      </div>
    </footer>
  );
};
