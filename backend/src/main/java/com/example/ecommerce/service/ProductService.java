package com.example.ecommerce.service;

import com.example.ecommerce.dto.ProductRequest;
import com.example.ecommerce.dto.ProductResponse;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.repository.ProductRepository;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<ProductResponse> findAll() {
        return productRepository.findAll().stream().map(this::toResponse).toList();
    }

    public ProductResponse findById(Long id) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        return toResponse(p);
    }

    @Transactional
    public ProductResponse create(ProductRequest request) {
        String sku = request.getSku().trim();
        if (productRepository.existsBySku(sku)) {
            throw new IllegalArgumentException("SKU already exists");
        }
        Product p = new Product();
        apply(p, request, sku);
        return toResponse(productRepository.save(p));
    }

    @Transactional
    public ProductResponse update(Long id, ProductRequest request) {
        Product p = productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Product not found"));
        String sku = request.getSku().trim();
        if (!sku.equalsIgnoreCase(p.getSku()) && productRepository.existsBySku(sku)) {
            throw new IllegalArgumentException("SKU already exists");
        }
        apply(p, request, sku);
        return toResponse(productRepository.save(p));
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found");
        }
        productRepository.deleteById(id);
    }

    private void apply(Product p, ProductRequest request, String sku) {
        p.setName(request.getName().trim());
        p.setDescription(request.getDescription() != null ? request.getDescription().trim() : null);
        p.setPrice(request.getPrice());
        p.setStockQuantity(request.getStockQuantity());
        p.setSku(sku);
    }

    private ProductResponse toResponse(Product p) {
        return new ProductResponse(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStockQuantity(),
                p.getSku()
        );
    }
}
