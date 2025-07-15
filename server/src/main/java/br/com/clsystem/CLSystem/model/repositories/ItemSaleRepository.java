package br.com.clsystem.CLSystem.model.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.com.clsystem.CLSystem.model.entities.Cashier;
import br.com.clsystem.CLSystem.model.entities.ItemSale;
import br.com.clsystem.CLSystem.model.entities.Product;
import br.com.clsystem.CLSystem.model.entities.Sale;
import br.com.clsystem.CLSystem.model.entities.projection.ItemSaleProjection;
import br.com.clsystem.CLSystem.types.StatusSale;

public interface ItemSaleRepository extends JpaRepository<ItemSale, Long> {
    List<ItemSaleProjection> findByIdSale(Sale idSale);
    List<ItemSaleProjection> findByIdSaleStatusSaleAndIdSaleIdCashier(StatusSale status, Cashier cashier);
    Optional<ItemSale> findByIdProductAndIdSale(Product idProduct, Sale idSale);
    Optional<ItemSaleProjection> findByIdItemSale(Long idItemSale);
}
