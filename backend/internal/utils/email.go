package utils

import (
    "bytes"
    "fmt"
    "html/template"
    "path/filepath"
    "strings"

    "github.com/huy1235588/fashion-e-commerce/internal/models"
    "gopkg.in/gomail.v2"
)

// EmailService handles email sending operations
type EmailService struct {
	Host     string
	Port     int
	Username string
	Password string
	FromName string
    TemplateDir string
}

// NewEmailService creates a new email service
func NewEmailService(host string, port int, username, password, fromName, templateDir string) *EmailService {
	return &EmailService{
		Host:     host,
		Port:     port,
		Username: username,
		Password: password,
		FromName: fromName,
        TemplateDir: templateDir,
	}
}

// SendEmail sends an email with HTML content
func (e *EmailService) SendEmail(to, subject, htmlBody string) error {
	m := gomail.NewMessage()
	m.SetHeader("From", fmt.Sprintf("%s <%s>", e.FromName, e.Username))
	m.SetHeader("To", to)
	m.SetHeader("Subject", subject)
	m.SetBody("text/html", htmlBody)

	d := gomail.NewDialer(e.Host, e.Port, e.Username, e.Password)

	if err := d.DialAndSend(m); err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}

	return nil
}

// SendPasswordResetEmail sends a password reset email with OTP code
func (e *EmailService) SendPasswordResetEmail(email, code string) error {
	subject := "Đặt lại mật khẩu - Fashion E-Commerce"

	data := map[string]any{
		"Code": code,
	}

	htmlBody, err := e.renderTemplate("password_reset.html", data)
	if err != nil {
		htmlBody = fmt.Sprintf(passwordResetFallbackTemplate, code)
	}

	return e.SendEmail(email, subject, htmlBody)
}

// SendOrderConfirmationEmail sends order confirmation email
func (e *EmailService) SendOrderConfirmationEmail(order *models.Order) error {
	subject := fmt.Sprintf("Xác nhận đơn hàng #%s - Fashion E-Commerce", order.OrderCode)
	
	// Build order items HTML
	var itemsHTML strings.Builder
	var subtotal float64
	
	for _, item := range order.OrderItems {
		itemsHTML.WriteString(fmt.Sprintf(`
			<tr>
				<td style="padding: 10px; border-bottom: 1px solid #eee;">%s</td>
				<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">%d</td>
				<td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">%s</td>
			</tr>
		`, item.ProductName, item.Quantity, formatCurrency(item.Price)))
		subtotal += item.Price * float64(item.Quantity)
	}
	
    shippingAddress := fmt.Sprintf("%s, %s, %s, %s",
        order.ShippingDetailAddress,
        order.ShippingWard,
        order.ShippingDistrict,
        order.ShippingProvince,
    )
	
	// Payment method
	paymentMethod := "Thanh toán khi nhận hàng (COD)"
	switch order.PaymentMethod {
	case models.PaymentMethodVNPay:
		paymentMethod = "VNPay"
	case models.PaymentMethodMoMo:
		paymentMethod = "MoMo"
	}
	
	// Order status
	statusText := map[string]string{
		"pending":    "Chờ xác nhận",
		"processing": "Đang xử lý",
		"shipping":   "Đang giao hàng",
		"delivered":  "Đã giao hàng",
		"cancelled":  "Đã hủy",
	}

	data := map[string]any{
		"FullName":        order.User.FullName,
		"OrderCode":       order.OrderCode,
		"Status":          statusText[string(order.Status)],
		"PaymentMethod":   paymentMethod,
		"ShippingAddress": shippingAddress,
		"ShippingPhone":   order.ShippingPhone,
		"ItemsHTML":       template.HTML(itemsHTML.String()),
		"Subtotal":        formatCurrency(order.SubtotalAmount),
		"ShippingFee":     formatCurrency(order.ShippingFee),
		"TotalAmount":     formatCurrency(order.TotalAmount),
	}

	htmlBody, err := e.renderTemplate("order_confirmation.html", data)
	if err != nil {
		htmlBody = fmt.Sprintf(orderConfirmationFallbackTemplate,
			order.User.FullName,
			order.OrderCode,
			statusText[string(order.Status)],
			paymentMethod,
			shippingAddress,
			order.ShippingPhone,
			itemsHTML.String(),
			formatCurrency(order.TotalAmount),
		)
	}

	return e.SendEmail(order.User.Email, subject, htmlBody)
}

// formatCurrency formats a float64 as Vietnamese currency
func formatCurrency(amount float64) string {
	return fmt.Sprintf("%s đ", formatNumber(int64(amount)))
}

// formatNumber formats a number with thousand separators
func formatNumber(n int64) string {
	if n < 0 {
		return "-" + formatNumber(-n)
	}
	if n < 1000 {
		return fmt.Sprintf("%d", n)
	}
	return formatNumber(n/1000) + "." + fmt.Sprintf("%03d", n%1000)
}

// renderTemplate renders an HTML template with provided data
func (e *EmailService) renderTemplate(name string, data any) (string, error) {
    tmplPath := filepath.Join(e.TemplateDir, name)
    tmpl, err := template.ParseFiles(tmplPath)
    if err != nil {
        return "", err
    }

    return e.ExecuteTemplate(tmpl, data)
}

// ExecuteTemplate executes a template and returns the result as a string
func (e *EmailService) ExecuteTemplate(tmpl *template.Template, data interface{}) (string, error) {
	var buf bytes.Buffer
	if err := tmpl.Execute(&buf, data); err != nil {
		return "", err
	}
	return buf.String(), nil
}

// passwordResetFallbackTemplate is used when template files are not available
const passwordResetFallbackTemplate = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
		.content { background-color: white; padding: 30px; border-radius: 5px; }
		.code { background-color: #f0f0f0; padding: 15px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 5px; color: #2563eb; }
		.warning { color: #dc2626; font-size: 14px; margin-top: 20px; }
		.footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
	</style>
</head>
<body>
	<div class="container">
		<div class="content">
			<h2>Đặt lại mật khẩu</h2>
			<p>Xin chào,</p>
			<p>Bạn nhận được email này vì đã yêu cầu đặt lại mật khẩu cho tài khoản Fashion E-Commerce của bạn.</p>
			<p>Mã xác thực của bạn là:</p>
			<div class="code">%s</div>
			<p>Mã này sẽ hết hạn sau <strong>15 phút</strong>.</p>
			<p class="warning">Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
		</div>
		<div class="footer">
			<p>© 2024 Fashion E-Commerce. All rights reserved.</p>
		</div>
	</div>
</body>
</html>
`

// orderConfirmationFallbackTemplate is used when template files are not available
const orderConfirmationFallbackTemplate = `
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<style>
		body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
		.container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; }
		.content { background-color: white; padding: 30px; border-radius: 5px; }
		.order-code { background-color: #2563eb; color: white; padding: 10px 20px; text-align: center; font-size: 18px; font-weight: bold; margin: 20px 0; border-radius: 5px; }
		.info-section { margin: 20px 0; padding: 15px; background-color: #f9fafb; border-radius: 5px; }
		.info-label { font-weight: bold; color: #666; }
		table { width: 100%%; border-collapse: collapse; margin: 20px 0; }
		th { background-color: #f3f4f6; padding: 10px; text-align: left; font-weight: bold; }
		.total-row { font-weight: bold; font-size: 16px; }
		.footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
	</style>
</head>
<body>
	<div class="container">
		<div class="content">
			<h2>Cảm ơn bạn đã đặt hàng!</h2>
			<p>Xin chào <strong>%s</strong>,</p>
			<p>Đơn hàng của bạn đã được tiếp nhận và đang được xử lý.</p>
			<div class="order-code">Mã đơn hàng: %s</div>
			<div class="info-section">
				<p><span class="info-label">Trạng thái:</span> %s</p>
				<p><span class="info-label">Phương thức thanh toán:</span> %s</p>
				<p><span class="info-label">Địa chỉ giao hàng:</span><br>%s</p>
				<p><span class="info-label">Số điện thoại:</span> %s</p>
			</div>
			<h3>Chi tiết đơn hàng</h3>
			<table>
				<thead>
					<tr>
						<th>Sản phẩm</th>
						<th style="text-align: center;">Số lượng</th>
						<th style="text-align: right;">Đơn giá</th>
					</tr>
				</thead>
				<tbody>
					%s
					<tr class="total-row">
						<td colspan="2" style="padding: 15px 10px; text-align: right;">Tổng cộng:</td>
						<td style="padding: 15px 10px; text-align: right; color: #2563eb;">%s</td>
					</tr>
				</tbody>
			</table>
			<p>Chúng tôi sẽ thông báo cho bạn khi đơn hàng được xử lý và giao đến địa chỉ của bạn.</p>
			<p>Nếu có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.</p>
		</div>
		<div class="footer">
			<p>© 2024 Fashion E-Commerce. All rights reserved.</p>
		</div>
	</div>
</body>
</html>
`
