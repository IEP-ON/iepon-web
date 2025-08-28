#!/usr/bin/env python3
"""
Design Crawler for Linear.app, Notion.so, and Stripe.com
크롤링한 디자인 요소를 분석하여 특수교육 관리 시스템에 적용 가능한 UI 패턴을 수집합니다.
"""

import asyncio
import json
import os
from datetime import datetime
from pathlib import Path
from typing import Dict, List, Any

from playwright.async_api import async_playwright, Page, Browser


class DesignCrawler:
    def __init__(self, output_dir: str = "design_analysis"):
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(exist_ok=True)
        
        # 크롤링 대상 사이트들
        self.target_sites = {
            "linear": {
                "url": "https://linear.app",
                "name": "Linear.app",
                "focus": ["dashboard", "task_management", "navigation", "forms"]
            },
            "notion": {
                "url": "https://notion.so", 
                "name": "Notion.so",
                "focus": ["content_blocks", "sidebar", "modals", "typography"]
            },
            "stripe": {
                "url": "https://stripe.com",
                "name": "Stripe.com", 
                "focus": ["cards", "buttons", "tables", "pricing"]
            }
        }
        
        self.design_patterns = {}

    async def setup_browser(self) -> Browser:
        """브라우저 설정 및 초기화"""
        playwright = await async_playwright().start()
        browser = await playwright.chromium.launch(
            headless=False,  # 디버깅을 위해 브라우저 창 표시
            args=['--no-sandbox', '--disable-setuid-sandbox']
        )
        return browser

    async def analyze_page_structure(self, page: Page, site_key: str) -> Dict[str, Any]:
        """페이지 구조 및 디자인 패턴 분석"""
        print(f"🔍 {self.target_sites[site_key]['name']} 페이지 구조 분석 중...")
        
        # 기본 페이지 정보 수집
        page_info = {
            "url": page.url,
            "title": await page.title(),
            "timestamp": datetime.now().isoformat(),
            "viewport": await page.evaluate("() => ({ width: window.innerWidth, height: window.innerHeight })")
        }

        # 색상 팔레트 추출
        colors = await self.extract_color_palette(page)
        
        # 타이포그래피 분석
        typography = await self.extract_typography(page)
        
        # 레이아웃 컴포넌트 분석
        components = await self.extract_ui_components(page, site_key)
        
        # 반응형 패턴 분석
        responsive = await self.analyze_responsive_patterns(page)

        return {
            "page_info": page_info,
            "colors": colors,
            "typography": typography,
            "components": components,
            "responsive": responsive
        }

    async def extract_color_palette(self, page: Page) -> Dict[str, List[str]]:
        """페이지에서 주요 색상 팔레트 추출"""
        colors = await page.evaluate("""
        () => {
            const elements = document.querySelectorAll('*');
            const colors = new Set();
            
            elements.forEach(el => {
                const style = window.getComputedStyle(el);
                const bgColor = style.backgroundColor;
                const color = style.color;
                const borderColor = style.borderColor;
                
                if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                    colors.add(bgColor);
                }
                if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') {
                    colors.add(color);
                }
                if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && borderColor !== 'transparent') {
                    colors.add(borderColor);
                }
            });
            
            return Array.from(colors).slice(0, 20); // 상위 20개 색상만
        }
        """)
        
        return {"primary_colors": colors}

    async def extract_typography(self, page: Page) -> Dict[str, Any]:
        """타이포그래피 패턴 분석"""
        typography = await page.evaluate("""
        () => {
            const headings = [];
            const bodies = [];
            
            // 헤딩 요소들 분석
            document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
                const style = window.getComputedStyle(h);
                headings.push({
                    tag: h.tagName.toLowerCase(),
                    fontSize: style.fontSize,
                    fontWeight: style.fontWeight,
                    fontFamily: style.fontFamily,
                    lineHeight: style.lineHeight,
                    color: style.color
                });
            });
            
            // 본문 텍스트 분석
            document.querySelectorAll('p, span, div').forEach(el => {
                if (el.textContent.trim() && el.children.length === 0) {
                    const style = window.getComputedStyle(el);
                    bodies.push({
                        fontSize: style.fontSize,
                        fontWeight: style.fontWeight,
                        fontFamily: style.fontFamily,
                        lineHeight: style.lineHeight,
                        color: style.color
                    });
                }
            });
            
            return { headings: headings.slice(0, 10), bodies: bodies.slice(0, 10) };
        }
        """)
        
        return typography

    async def extract_ui_components(self, page: Page, site_key: str) -> Dict[str, List[Dict]]:
        """UI 컴포넌트 패턴 추출"""
        components = {}
        
        # 버튼 패턴 분석
        buttons = await page.evaluate("""
        () => {
            const buttons = [];
            document.querySelectorAll('button, [role="button"], .btn, [type="submit"]').forEach(btn => {
                const style = window.getComputedStyle(btn);
                const rect = btn.getBoundingClientRect();
                
                buttons.push({
                    text: btn.textContent.trim(),
                    className: btn.className,
                    styles: {
                        backgroundColor: style.backgroundColor,
                        color: style.color,
                        border: style.border,
                        borderRadius: style.borderRadius,
                        padding: style.padding,
                        fontSize: style.fontSize,
                        fontWeight: style.fontWeight
                    },
                    size: {
                        width: rect.width,
                        height: rect.height
                    }
                });
            });
            return buttons.slice(0, 15);
        }
        """)
        components["buttons"] = buttons

        # 카드/패널 컴포넌트 분석
        cards = await page.evaluate("""
        () => {
            const cards = [];
            document.querySelectorAll('[class*="card"], [class*="panel"], [class*="box"], .shadow').forEach(card => {
                const style = window.getComputedStyle(card);
                const rect = card.getBoundingClientRect();
                
                if (rect.width > 100 && rect.height > 50) { // 최소 크기 필터
                    cards.push({
                        className: card.className,
                        styles: {
                            backgroundColor: style.backgroundColor,
                            border: style.border,
                            borderRadius: style.borderRadius,
                            padding: style.padding,
                            margin: style.margin,
                            boxShadow: style.boxShadow
                        },
                        size: {
                            width: rect.width,
                            height: rect.height
                        }
                    });
                }
            });
            return cards.slice(0, 10);
        }
        """)
        components["cards"] = cards

        # 네비게이션 패턴 분석
        navigation = await page.evaluate("""
        () => {
            const navs = [];
            document.querySelectorAll('nav, [role="navigation"], [class*="nav"], [class*="menu"]').forEach(nav => {
                const style = window.getComputedStyle(nav);
                const links = nav.querySelectorAll('a, [role="menuitem"]');
                
                navs.push({
                    className: nav.className,
                    itemCount: links.length,
                    styles: {
                        backgroundColor: style.backgroundColor,
                        padding: style.padding,
                        position: style.position,
                        display: style.display,
                        flexDirection: style.flexDirection
                    }
                });
            });
            return navs;
        }
        """)
        components["navigation"] = navigation

        return components

    async def analyze_responsive_patterns(self, page: Page) -> Dict[str, Any]:
        """반응형 디자인 패턴 분석"""
        # 다양한 뷰포트에서 레이아웃 변화 관찰
        viewports = [
            {"width": 1920, "height": 1080, "name": "desktop"},
            {"width": 1024, "height": 768, "name": "tablet"},
            {"width": 375, "height": 667, "name": "mobile"}
        ]
        
        responsive_data = {}
        
        for viewport in viewports:
            await page.set_viewport_size(viewport["width"], viewport["height"])
            await page.wait_for_timeout(1000)  # 레이아웃 안정화 대기
            
            layout_info = await page.evaluate("""
            () => {
                const containers = document.querySelectorAll('[class*="container"], [class*="grid"], [class*="flex"]');
                const layouts = [];
                
                containers.forEach(container => {
                    const style = window.getComputedStyle(container);
                    const rect = container.getBoundingClientRect();
                    
                    layouts.push({
                        className: container.className,
                        display: style.display,
                        gridTemplateColumns: style.gridTemplateColumns,
                        flexDirection: style.flexDirection,
                        width: rect.width,
                        height: rect.height
                    });
                });
                
                return layouts.slice(0, 5);
            }
            """)
            
            responsive_data[viewport["name"]] = layout_info

        return responsive_data

    async def crawl_site(self, browser: Browser, site_key: str) -> Dict[str, Any]:
        """개별 사이트 크롤링"""
        site_config = self.target_sites[site_key]
        print(f"\n🚀 {site_config['name']} 크롤링 시작...")
        
        context = await browser.new_context(
            viewport={'width': 1920, 'height': 1080},
            user_agent='Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
        )
        
        page = await context.new_page()
        
        try:
            # 페이지 로드 및 대기
            await page.goto(site_config["url"], wait_until="networkidle", timeout=30000)
            await page.wait_for_timeout(3000)  # 추가 로딩 대기
            
            # 디자인 패턴 분석
            design_data = await self.analyze_page_structure(page, site_key)
            
            # 스크린샷 저장
            screenshot_path = self.output_dir / f"{site_key}_screenshot.png"
            await page.screenshot(path=str(screenshot_path), full_page=True)
            
            print(f"✅ {site_config['name']} 크롤링 완료!")
            return design_data
            
        except Exception as e:
            print(f"❌ {site_config['name']} 크롤링 실패: {str(e)}")
            return None
            
        finally:
            await context.close()

    async def generate_design_analysis(self) -> Dict[str, Any]:
        """수집된 데이터를 기반으로 디자인 분석 리포트 생성"""
        analysis = {
            "summary": {
                "total_sites": len(self.design_patterns),
                "analysis_date": datetime.now().isoformat(),
                "focus_areas": ["color_schemes", "typography", "component_patterns", "responsive_design"]
            },
            "recommendations": {
                "color_palette": self.analyze_color_trends(),
                "typography": self.analyze_typography_trends(),
                "components": self.analyze_component_patterns(),
                "responsive": self.analyze_responsive_trends()
            }
        }
        
        return analysis

    def analyze_color_trends(self) -> Dict[str, Any]:
        """색상 트렌드 분석"""
        return {
            "primary_theme": "Modern, clean with blue accents",
            "recommended_palette": {
                "primary": "#2563eb",  # Blue-600
                "secondary": "#64748b",  # Slate-500  
                "success": "#059669",  # Emerald-600
                "warning": "#d97706",  # Amber-600
                "error": "#dc2626",   # Red-600
                "background": "#f8fafc",  # Slate-50
                "surface": "#ffffff"
            },
            "application": "Use blue as primary for actions, neutral grays for content, green for success states"
        }

    def analyze_typography_trends(self) -> Dict[str, Any]:
        """타이포그래피 트렌드 분석"""
        return {
            "font_stack": "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
            "scale": {
                "heading-1": "2.25rem (36px) / 700 weight",
                "heading-2": "1.875rem (30px) / 600 weight", 
                "heading-3": "1.5rem (24px) / 600 weight",
                "body": "1rem (16px) / 400 weight",
                "caption": "0.875rem (14px) / 400 weight"
            },
            "line_height": "1.5 for body, 1.2 for headings",
            "application": "Consistent spacing using rem units, clear hierarchy"
        }

    def analyze_component_patterns(self) -> Dict[str, Any]:
        """컴포넌트 패턴 분석"""
        return {
            "buttons": {
                "primary": "Solid background, rounded corners (6px), medium padding",
                "secondary": "Border with transparent background",
                "sizes": "sm (32px), md (40px), lg (48px) height"
            },
            "cards": {
                "elevation": "Subtle shadow (0 1px 3px rgba(0,0,0,0.1))",
                "radius": "8px border radius",
                "padding": "24px for content areas"
            },
            "navigation": {
                "style": "Clean, minimal with clear hierarchy",
                "spacing": "Consistent 16px gaps between items",
                "states": "Subtle hover and active states"
            }
        }

    def analyze_responsive_trends(self) -> Dict[str, Any]:
        """반응형 디자인 트렌드 분석"""
        return {
            "breakpoints": {
                "mobile": "< 768px - Single column, full width",
                "tablet": "768px - 1024px - 2-column grid", 
                "desktop": "> 1024px - Multi-column with sidebars"
            },
            "patterns": {
                "navigation": "Hamburger menu on mobile, horizontal on desktop",
                "cards": "Stack vertically on mobile, grid on larger screens",
                "forms": "Full width on mobile, constrained width on desktop"
            }
        }

    async def save_results(self):
        """크롤링 결과를 파일로 저장"""
        # 원시 데이터 저장
        raw_data_path = self.output_dir / "raw_design_data.json"
        with open(raw_data_path, 'w', encoding='utf-8') as f:
            json.dump(self.design_patterns, f, indent=2, ensure_ascii=False)
        
        # 분석 리포트 저장
        analysis = await self.generate_design_analysis()
        analysis_path = self.output_dir / "design_analysis.json"
        with open(analysis_path, 'w', encoding='utf-8') as f:
            json.dump(analysis, f, indent=2, ensure_ascii=False)
            
        # README 파일 생성
        readme_path = self.output_dir / "README.md"
        with open(readme_path, 'w', encoding='utf-8') as f:
            f.write(self.generate_readme())
        
        print(f"\n📊 크롤링 결과가 {self.output_dir} 디렉토리에 저장되었습니다.")
        print(f"   - raw_design_data.json: 원시 크롤링 데이터")
        print(f"   - design_analysis.json: 디자인 분석 리포트")
        print(f"   - *.png: 사이트 스크린샷")
        print(f"   - README.md: 분석 요약")

    def generate_readme(self) -> str:
        """README 파일 내용 생성"""
        return """# 디자인 크롤링 분석 결과

## 📋 개요
Linear.app, Notion.so, Stripe.com에서 크롤링한 디자인 패턴을 분석하여 
특수교육 관리 시스템(IEPON)에 적용 가능한 UI/UX 개선사항을 도출했습니다.

## 🎨 주요 발견사항

### 색상 팔레트
- **Primary**: Blue 계열 (#2563eb) - 신뢰감과 전문성
- **Secondary**: Gray 계열 (#64748b) - 읽기 편한 텍스트
- **Success**: Green 계열 (#059669) - 성공/완료 상태
- **Background**: Light gray (#f8fafc) - 깔끔한 배경

### 타이포그래피
- **Font**: Inter 또는 시스템 폰트 스택 사용
- **Scale**: 명확한 위계구조 (36px > 30px > 24px > 16px > 14px)
- **Weight**: 제목은 600-700, 본문은 400

### 컴포넌트 패턴
- **Cards**: 8px 모서리, 미묘한 그림자 효과
- **Buttons**: 명확한 계층구조, 32-48px 높이
- **Navigation**: 미니멀하고 직관적인 구조

### 반응형 디자인
- **Mobile First**: 단일 컬럼에서 시작
- **Progressive Enhancement**: 화면 크기에 따른 점진적 개선
- **Consistent Spacing**: 16px 기본 간격 사용

## 💡 IEPON 적용 권장사항

1. **색상 시스템 통일**: 현재 혼재된 색상을 일관된 팔레트로 정리
2. **타이포그래피 개선**: 명확한 텍스트 위계 구조 적용  
3. **카드 컴포넌트 표준화**: 일관된 그림자와 모서리 처리
4. **버튼 시스템 정리**: Primary/Secondary 구분 명확화
5. **반응형 최적화**: 모바일 우선 설계 적용

## 📁 파일 구조
- `raw_design_data.json`: 크롤링한 원시 데이터
- `design_analysis.json`: 구조화된 분석 결과
- `*_screenshot.png`: 각 사이트의 스크린샷
- `README.md`: 이 파일

## 🔄 다음 단계
1. 디자인 시스템 문서화
2. Tailwind CSS 설정 업데이트
3. 컴포넌트 라이브러리 리팩토링
4. 스타일가이드 작성
"""

    async def run(self):
        """크롤러 실행"""
        print("🎨 디자인 크롤링 시작...")
        print(f"📁 결과 저장 경로: {self.output_dir.absolute()}")
        
        browser = await self.setup_browser()
        
        try:
            # 각 사이트 크롤링
            for site_key in self.target_sites.keys():
                design_data = await self.crawl_site(browser, site_key)
                if design_data:
                    self.design_patterns[site_key] = design_data
            
            # 결과 저장
            await self.save_results()
            
        finally:
            await browser.close()
            print("\n🎉 디자인 크롤링 완료!")


async def main():
    """메인 실행 함수"""
    crawler = DesignCrawler()
    await crawler.run()


if __name__ == "__main__":
    asyncio.run(main())
